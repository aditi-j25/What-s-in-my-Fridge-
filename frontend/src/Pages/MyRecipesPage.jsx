import "./MyRecipesPage.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyRecipesPage() {
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

    fetch(`http://localhost:8000/recipes/${userId}`)
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
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="my-recipes-page">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-text">WHAT'S IN MY FRIDGE?</span>
        </div>
        <div className="navbar-links">
          <button className="nav-link" onClick={() => navigate("/home")}>Home</button>
          <button className="nav-link active" onClick={() => navigate("/recipes")}>My Recipes</button>
          <button className="nav-profile" onClick={() => navigate("/login")}>Login</button>
        </div>
      </nav>
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
                <p>{recipe.recipe_instructions[0]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedRecipe.recipe_name[0]}</h2>
            <h3>Ingredients:</h3>
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
    </div>
  );
}

export default MyRecipesPage;
