import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recipie_generation import RecipeRequest,RecipeResponse,generate_recipe
from DbConnect import insert_user, get_user

class UserRequest(BaseModel):
    username: str
    email: str
    password: str

app = FastAPI(title ="What's in my Fridge API")

#CORS Implementation
origins =[
    "http://localhost:3000",
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

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)