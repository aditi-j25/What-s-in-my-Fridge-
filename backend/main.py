import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from recipie_generation import RecipeRequest,RecipeResponse,SaveRecipeRequest,generate_recipe
from DbConnect import insert_user, get_user, get_recipes, get_ingredients, save_recipe_to_db, search_recipes_by_name
from typing import Optional

class UserRequest(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

app = FastAPI(title ="What's in my Fridge API")

#CORS Implementation
origins =[
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
    
)

#Routes
@app.get('/')
async def root():
    return{"message": "API is running"}

@app.post("/generate-recipe", response_model=RecipeResponse)
def create_recipe(request: RecipeRequest):

    recipe = generate_recipe(request.ingredients)

    return recipe

@app.post("/signup")
def signup(user: UserRequest):
    try:
        insert_user(user.username, user.password ,user.email)
        return {"message": "User created successfully"}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/login")
def login(user: UserRequest):
    try:
        user_data = get_user(username=user.username)[0]
        if user_data and user_data["Password"] == user.password:
            return {"message": "Login successful", "user_id": user_data["user_id"]}
        else:
            return {"error": "Invalid credentials"}
    except Exception as e:
        return {"error": "Invalid credentials"}

@app.get("/myrecipes/{user_id}")
def get_user_recipes(user_id: int):
    try:
        recipes = get_recipes(user_id=user_id)
        for recipe in recipes:
            ingredients = get_ingredients(user_id=user_id, recipe_id=recipe['recipe_id'])
            recipe['ingredients'] = [ing['ingredient_name'] for ing in ingredients]  
        return {"recipes": recipes}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/save-recipe")
def save_recipe(request: SaveRecipeRequest):
    try:
        result = save_recipe_to_db(
          user_id=request.user_id,
          recipe=request.recipe
        )

        return result
    except Exception as e:
        return{"error": str(e)}
    
@app.get("/search-recipes")
def search_recipes_endpoint(keyword: str = Query(...)):
    try:
        results = search_recipes_by_name(keyword)

        if not results:
            return {"recipes": []}

        titles = [
            r["recipe_name"][0]
            for r in results
            if r.get("recipe_name")
        ]

        return {"recipes": titles}

    except Exception as e:
        print(e)
        return {"recipes": []}    
    
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)