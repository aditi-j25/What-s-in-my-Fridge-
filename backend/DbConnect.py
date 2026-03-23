#pip install supabase 
#-----------------------------------------------------------------------------------------------------------------------------------------
from supabase import create_client

url = "https://zrctmoysxnhzgyzbrvan.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyY3Rtb3lzeG5oemd5emJydmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjgzMTEsImV4cCI6MjA4OTAwNDMxMX0.TSFF86hfFtVoW5RLzbk8oiCckLGVr9Tn5kVqG8eHZIs"
supabase = create_client(url, key)

# ─── INSERT ───────────────────────────────────────────────
def insert_user(username: str, password: str, email: str):
    """Add a new user to User_Info."""
    try:
      if search_user_by_email(email):
        return get_user(username=username)
      else:
        response = supabase.table("User_Info").insert({
            "Username": username,
            "Password": password,
            "Email":    email,
        }).execute()
        return response.data
    except Exception as e:
        print(f"Insert user error: {e}")
        return None

# def insert_recipe(user_id: int, recipe_name: list, recipe_instructions: list, prep_time: str, cook_time: str, servings: str):
#     """Add a new generated recipe linked to a user."""
#     try:
#       if search_recipes_by_name(recipe_name):
#         return get_recipes(user_id=user_id)
#       else:
#         response = supabase.table("Generated_Recipes").insert({
#             "user_id":              user_id,
#             "recipe_name":         recipe_name,        # _text = array of text
#             "recipe_instructions": recipe_instructions, # _text = array of text
#             "prep_time" : prep_time, # text
#             "cook_time" : cook_time, # text
#             "servings" : servings # text
#         }).execute()
#         return response.data
#     except Exception as e:
#         print(f"Insert recipe error: {e}")
#         return None

def save_recipe_to_db(user_id, recipe):
    #recipe details
    try:
        recipe_res = supabase.table("Generated_Recipes").insert({
            "user_id": user_id,
            "recipe_name": [recipe["title"]],
            "recipe_instructions": [step["instruction"] for step in recipe["steps"]],
            "prep_time": recipe["prep_time"],
            "cook_time": recipe["cook_time"],
            "servings": str(recipe["servings"])
        }).execute()

        recipe_id = recipe_res.data[0]["recipe_id"]
        
        # put measurement and ingredient into arrays
        ingredient_names = []
        measurements = []

        for ing in recipe["ingredients"]:
            ingredient_names.append(ing["name"])
            measurements.append(ing["measurement"])

        supabase.table("Ingredients_List").insert({
            "user_id": user_id,
            "recipe_id": recipe_id,
            "ingredient_name": ingredient_names,
            "measurement": measurements
        }).execute()

        return {"message": "Recipe saved"}

    except Exception as e:
        print(e)
        return None
    

def insert_ingredients(user_id: int, recipe_id: int, ingredient_name: list):
    """Add ingredients linked to a user and recipe."""
    try:
      if search_ingredients_by_name(ingredient_name):
        return get_ingredients(user_id=user_id, recipe_id=recipe_id)
      else:
        response = supabase.table("Ingredients_List").insert({
            "user_id":         user_id,
            "recipe_id":       recipe_id,
            "ingredient_name": ingredient_name , # _text = array of text   
        }).execute()
        return response.data
    except Exception as e:
        print(f"Insert ingredients error: {e}")
        return None

# ─── RETRIEVE ─────────────────────────────────────────────
def get_user(user_id: int = None, username: str = None):
    """Fetch a user by user_id or Username."""
    try:
        query = supabase.table("User_Info").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        if username:
            query = query.eq("Username", username)
        return query.execute().data
    except Exception as e:
        print(f"Get user error: {e}")
        return None

def get_recipes(user_id: int = None, recipe_id: int = None):
    """Fetch recipes, optionally filtered by user or recipe ID."""
    try:
        query = supabase.table("Generated_Recipes").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        if recipe_id:
            query = query.eq("recipe_id", recipe_id)
        return query.execute().data
    except Exception as e:
        print(f"Get recipes error: {e}")
        return None

def get_ingredients(user_id: int = None, recipe_id: int = None):
    """Fetch ingredients, optionally filtered by user or recipe."""
    try:
        query = supabase.table("Ingredients_List").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        if recipe_id:
            query = query.eq("recipe_id", recipe_id)
        return query.execute().data
    except Exception as e:
        print(f"Get ingredients error: {e}")
        return None

# ─── EDIT ─────────────────────────────────────────────────
def edit_user(user_id: int, updates: dict):
    """
    Update a user's info by user_id.
    updates = {"Email": "new@email.com", "Password": "newpass"}
    """
    try:
        response = (
            supabase.table("User_Info")
            .update(updates)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Edit user error: {e}")
        return None

def edit_recipe(recipe_id: int, updates: dict):
    """
    Update a recipe by recipe_id.
    updates = {"recipe_name": [...], "recipe_instructions": [...]}
    """
    try:
        response = (
            supabase.table("Generated_Recipes")
            .update(updates)
            .eq("recipe_id", recipe_id)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Edit recipe error: {e}")
        return None

def edit_ingredients(ingredients_id: int, updates: dict):
    """
    Update an ingredient row by ingredients_id.
    updates = {"ingredient_name": [...]}
    """
    try:
        response = (
            supabase.table("Ingredients_List")
            .update(updates)
            .eq("ingredients_id", ingredients_id)
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Edit ingredients error: {e}")
        return None

# ─── SEARCH ───────────────────────────────────────────────
def search_recipes_by_name(keyword: str):
    """Search Generated_Recipes where any element in recipe_name contains the keyword."""
    try:
        response = (
            supabase.table("Generated_Recipes")
            .select("*")
            .filter("recipe_name", "cs", f'{{"*{keyword}*"}}')  # array contains
            .execute()
        )
        # fallback: fetch all and filter in Python if above returns empty
        if not response.data:
            all_recipes = supabase.table("Generated_Recipes").select("*").execute().data
            return [
                r for r in all_recipes
                if any(keyword.lower() in name.lower() for name in (r.get("recipe_name") or []))
            ]
        return response.data
    except Exception as e:
        print(f"Search recipe error: {e}")
        return None

def search_ingredients_by_name(keyword: str):
    """Search Ingredients_List where any element in ingredient_name contains the keyword."""
    try:
        all_ingredients = supabase.table("Ingredients_List").select("*").execute().data
        return [
            i for i in all_ingredients
            if any(keyword.lower() in ing.lower() for ing in (i.get("ingredient_name") or []))
        ]
    except Exception as e:
        print(f"Search ingredient error: {e}")
        return None

def search_user_by_email(keyword: str):
    """Search User_Info by partial email match — Email is plain text, ilike works fine."""
    try:
        response = (
            supabase.table("User_Info")
            .select("*")
            .ilike("Email", f"%{keyword}%")
            .execute()
        )
        return response.data
    except Exception as e:
        print(f"Search user error: {e}")
        return None

#-----------------------------------------------------------------------------------------------------------------------------------------
#TEST OBJECTS 
'''
# INSERT
insert_user("john_doe", "securepass123", "john@email.com")
insert_user("jane_smith", "pass456", "jane@email.com")
insert_recipe(1, ["Pasta Carbonara"], ["Boil pasta", "Mix eggs and cheese", "Combine"])
insert_ingredients(1, 1, ["pasta", "eggs", "parmesan", "bacon"])

# RETRIEVE
print(get_user(user_id=1))
print(get_recipes(user_id=1))
print(get_ingredients(recipe_id=1))

# EDIT
edit_user(1, {"Email": "newemail@gmail.com"})
edit_recipe(1, {"recipe_name": ["Pasta Carbonara Updated"]})
edit_ingredients(1, {"ingredient_name": ["pasta", "eggs", "pecorino", "guanciale"]})

# SEARCH
print(search_recipes_by_name("pasta"))
print(search_ingredients_by_name("egg"))
print(search_user_by_email("gmail.com"))
'''
