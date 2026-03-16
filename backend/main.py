from fastapi import FastAPI
from recipie_generation import RecipeRequest,RecipeResponse,generate_recipe

app = FastAPI(title ="What's in my Fridge API")
@app.get('/')
async def root():
    return{"message": "API is running"}

@app.post("/generate-recipe", response_model=RecipeResponse)
def create_recipe(request: RecipeRequest):

    recipe = generate_recipe(request.ingredients)

    return recipe