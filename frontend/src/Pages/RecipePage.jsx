import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PiChefHatFill } from "react-icons/pi";
import "./RecipePage.css";

export default function RecipePage({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

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
        <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
        </button>
        <h1>{recipe.title}</h1>

        {/* Info Section */}
        <div
          className="recipe-section recipe-info"
        >
          <p>
            <strong>Prep Time:</strong> {recipe.prep_time}
          </p>
          <p>
            <strong>Cook Time:</strong> {recipe.cook_time}
          </p>
          <p>
            <strong>Servings:</strong> {recipe.servings}
          </p>
        </div>

        {/* Ingredients Section */}
        <div
          className="recipe-section recipe-ingredients"
        >
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>
                {item.measurement} {item.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps Section */}
        <div className="recipe-section recipe-steps">
          <h3>Steps</h3>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step.step_number}>{step.instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}