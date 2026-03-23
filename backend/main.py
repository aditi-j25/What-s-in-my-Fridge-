import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from recipie_generation import RecipeRequest,RecipeResponse,SaveRecipeRequest,generate_recipe
from DbConnect import insert_user, get_user, get_recipes, get_ingredients, save_recipe_to_db, search_recipes_by_name
from typing import Optional, List, Dict

class UserRequest(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversationHistory: List[ChatMessage] = []

app = FastAPI(title ="What's in my Fridge API")

#CORS Implementation
origins =[
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://whats-in-my-fridge-gamma.vercel.app",
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
    
@app.post("/chat")
async def chat(request: dict):
    """
    MySousChef chatbot - uses SAME method as recipie_generation.py
    """
    try:
        
        # Load API key 
        load_dotenv()
        API_KEY = os.getenv("GEMINI_API_KEY")
        
        # If no .env file, use hardcoded key
        if not API_KEY:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure 
        genai.configure(api_key=API_KEY)
        
    
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Build context
        context = """You are MySousChef, a friendly cooking assistant. 
Help with nutritional information, cooking tips, and ingredient uses.
Be concise and helpful. Keep responses under 150 words.

"""
        
        # Add conversation history
        conversation_history = request.get("conversationHistory", [])
        for msg in conversation_history[-5:]:
            role = "User" if msg.get("role") == "user" else "MySousChef"
            context += f"{role}: {msg.get('content', '')}\n"
        
        # Add current message
        user_message = request.get("message", "")
        context += f"User: {user_message}\nMySousChef: "
        
        # Generate response 
        response = model.generate_content(context)
        
        # Return text 
        return {"response": response.text}
        
    except Exception as e:
        print(f"Chat error: {e}")
        import traceback
        traceback.print_exc()
        return {"response": "Sorry, I'm having trouble right now. Please try again."}

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
