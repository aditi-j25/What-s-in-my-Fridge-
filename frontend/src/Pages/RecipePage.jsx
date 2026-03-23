import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiChefHatFill } from "react-icons/pi";
import "./RecipePage.css";

export default function RecipePage({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

  const [isSaved, setIsSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!recipe?.title) {
        setCheckingSaved(false);
        return;
      }

      try {
        const res = await fetch(
          `https://what-s-in-my-fridge-gop7.onrender.com?keyword=${encodeURIComponent(recipe.title)}`
        );
        const data = await res.json();

        const exists = (data.recipes || []).some(
          (title) => title.toLowerCase() === recipe.title.toLowerCase()
        );

        setIsSaved(exists);
      } catch (err) {
        console.error("Error checking saved recipe:", err);
        setIsSaved(false);
      } finally {
        setCheckingSaved(false);
      }
    };

    checkIfSaved();
  }, [recipe]);

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");

    try {
      const response = await fetch("https://what-s-in-my-fridge-gop7.onrender.com/save-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          recipe: recipe,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const data = await response.json();
      console.log("Saved:", data);

      setIsSaved(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) {
    return <h2>No recipe found</h2>;
  }

  return (
    <div>
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
              <button
                className={`nav-link ${location.pathname === "/mybot" ? "active" : ""}`}
                onClick={() => navigate("/mybot")}
              >
                MySousChef
              </button>
                <button className="nav-profile" onClick={onLogout}>
                  <PiChefHatFill /> Logout
                </button>
              </div>
            </nav>
        
      <div className="recipe-container" style={{ padding: "2rem" }}>
        <h1>{recipe.title}</h1>

        <div className="recipe-section recipe-info">
          <p><strong>Prep Time:</strong> {recipe.prep_time}</p>
          <p><strong>Cook Time:</strong> {recipe.cook_time}</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
        </div>

        <div className="recipe-section recipe-ingredients">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>
                {item.measurement} {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-section recipe-steps">
          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step.step_number}>{step.instruction}</li>
            ))}
          </ol>
        </div>

        <div className="recipe-buttons">
          {checkingSaved ? (
            <button className="back-btn" disabled>
              Checking...
            </button>
          ) : isSaved ? (
            <button className="back-btn" disabled>
              Saved!
            </button>
          ) : (
            <button onClick={handleSave} className="back-btn">
              Save Recipe
            </button>
          )}

          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}