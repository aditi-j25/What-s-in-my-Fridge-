import os
import json
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from prompts import RECIPE_PROMPT

class RecipeRequest(BaseModel):
    ingredients : List[str]

class Ingredient(BaseModel):
    name: str
    measurement: str

class Step(BaseModel):
    step_number: int
    instruction: str


class RecipeResponse(BaseModel):
    title: str
    prep_time: str
    cook_time: str
    servings: int
    ingredients: List[Ingredient]
    steps: List[Step]

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_recipe(ingredients):

    prompt = f"""
    {RECIPE_PROMPT}

    User ingredients:
    {ingredients}
    """

    response = model.generate_content(prompt)

    recipe_text = response.text

    return json.loads(recipe_text)