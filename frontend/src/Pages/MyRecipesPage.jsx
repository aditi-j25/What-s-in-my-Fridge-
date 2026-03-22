import "./MyRecipesPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiShinyApple } from "react-icons/gi";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { PiChefHatFill } from "react-icons/pi";


function MyRecipesPage({onLogout }) {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setError('Please login to view your recipes');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/myrecipes/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setRecipes(data.recipes || []);
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load recipes');
        setLoading(false);
      });
  }, []);

  const handleRecipeClick = (recipe) => {
    const formatted = {
      title: recipe.recipe_name[0],
      prep_time: recipe.prep_time || "N/A",
      cook_time: recipe.cook_time || "N/A",
      servings: recipe.servings || "N/A",
      ingredients: recipe.ingredients.flat().map((ing) => ({
        measurement: "",
        name: ing,
      })),
      steps: recipe.recipe_instructions.map((instruction, idx) => ({
        step_number: idx + 1,
        instruction,
      })),
    };
    navigate("/recipe", { state: { recipe: formatted } });
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="my-recipes-page">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">

          <span className="logo-text">WHAT'S IN MY FRIDGE?</span>
        </div>
        <div className="navbar-links">
          <button
            className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            Home
          </button>
              <button
                className={`nav-link ${location.pathname === "/input" ? "active" : ""}`}
                onClick={() => navigate("/input")}
              >
                Add Ingredients
              </button>
              <button
                className={`nav-link ${location.pathname === "/myrecipes" ? "active" : ""}`}
                onClick={() => navigate("/myrecipes")}
              >
                My Recipes
              </button>
              <button className="nav-profile" onClick={onLogout}>
                <PiChefHatFill /> Logout
              </button>
        </div>
      </nav>
      
      {/* ── My Recipe Content ── */}
      <div className="recipes-content">
        <h1>My Recipes</h1>
        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : recipes.length === 0 ? (
          <p>No recipes found. Generate some recipes first!</p>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.recipe_id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <h3>{recipe.recipe_name[0]}</h3>
                <p>{recipe.ingredients.join(" , ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 
      -----CHANGED THIS TO NAVIGATE TO RECIPE PAGE INSTEAD OF OPENING MODAL--------


      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedRecipe.recipe_name[0]}</h2>
            <h3>Ingredients Entered:</h3>
            <ul>
              {selectedRecipe.ingredients.flat().map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <ol>
              {selectedRecipe.recipe_instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <button onClick={closeModal}>Close</button>
          </div>
        </div> 
        
      )}
       */
} 
    </div> 
    
  );
}

export default MyRecipesPage;
