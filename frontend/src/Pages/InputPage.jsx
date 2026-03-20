import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PiChefHatFill, PiCamera, PiBarcode, PiTextAa } from "react-icons/pi";
import "./InputPage.css";

function InputPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("menu");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);

  // text submit
  const handleSubmit = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients.split(",").map((i) => i.trim()),
        }),
      });

      const data = await response.json();
      navigate("/recipe", { state: { recipe: data } });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-text">WHAT'S IN MY FRIDGE?</span>
        </div>
        <div className="navbar-links">
          <button className="nav-link active" onClick={() => navigate("/home")}>
            Home
          </button>
          <button className="nav-link" onClick={() => navigate("/recipes")}>
            My Recipes
          </button>
          <button className="nav-profile" onClick={() => navigate("/login")}>
            <PiChefHatFill /> Login
          </button>
        </div>
      </nav>

      {/* input options menu */}
      {mode === "menu" && (
        <section className="input-section">
          <h1>Add Ingredients</h1>

          <div className="cards-grid">
            <div className="input-card">
              <PiCamera className="input-icon" />
              <h2>Camera</h2>
            </div>

            <div className="input-card">
              <PiBarcode className="input-icon" />
              <h2>Barcode</h2>
            </div>

            <div onClick={() => setMode("text")} className="input-card">
              <PiTextAa className="input-icon" />
              <h2>Text</h2>
            </div>
          </div>
        </section>
      )}

      {/* text input */}
      {mode === "text" && (
        <section className="input-section">
          <div className="input-container">
            <textarea
              className="input-textarea"
              placeholder="Enter ingredients (e.g. eggs, milk, cheese)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />

            <button
              className="primary-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Recipe"}
            </button>

            <button onClick={() => setMode("menu")} className="primary-button back">
              Back
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default InputPage;