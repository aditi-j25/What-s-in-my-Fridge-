import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recipie_generation import RecipeRequest,RecipeResponse,generate_recipe

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
    try:
        return generate_recipe(request.ingredients)
    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)