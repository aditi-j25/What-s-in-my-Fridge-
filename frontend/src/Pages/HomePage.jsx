import React from "react";
import { useNavigate } from "react-router-dom";
import { RiRobot2Fill } from "react-icons/ri";
import { GiShinyApple } from "react-icons/gi";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { PiChefHatFill } from "react-icons/pi";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const quickCards = [
    {
      icon: <RiRobot2Fill />,
      title: "MySousChef",
      desc: "Ask your AI cooking assistant questions, get recipe ideas, and learn kitchen tips instantly.",
      path: "/signup",
      colorClass: "card-bot",
    },
    {
      icon: <GiShinyApple />,
      title: "Add Ingredients",
      desc: "What's in your fridge? Add ingredients to get personalized recipe suggestions, and learn more about them.",
      path: "/signup",
      colorClass: "card-ingredients",
    },
    {
      icon: <GiForkKnifeSpoon />,
      title: "My Recipes",
      desc: "View and edit your saved recipes along with nutritional information.",
      path: "/signup",
      colorClass: "card-recipes",
    },
  ];

  return (
    <div className="homepage">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">

          <span className="logo-text">WHAT'S IN MY FRIDGE?</span>
        </div>
        <div className="navbar-links">
          <button className="nav-link active" onClick={() => navigate("/home")}>Home</button>
          <button className="nav-link" onClick={() => navigate("/recipes")}>My Recipes</button>
          <button className="nav-profile" onClick={() => navigate("/login")}>
            <PiChefHatFill /> Login
          </button>
        </div>
      </nav>

      {/* ── Banner ── */}
      <section className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="hero-content">
          <h1 className="hero-heading">
            What are we<br />cooking today?
          </h1>
          <p className="hero-sub">
            What's In My Fridge is your personal cooking assistant that helps you make the most of the ingredients you have. Add your ingredients, get personalized recipe suggestions, and save your favorite recipes all in one place.
          </p>
          <button className="hero-btn" onClick={() => navigate("/login")}>
            Signup or Signin to Get Started!
          </button>
        </div>

        <div className="hero-emoji"></div>
      </section>


      {/* ── Quick Access Cards ── */}
      <section className="quick-access">
        <h2 className="section-title">Our Promise!</h2>
        <div className="cards-grid">
          {quickCards.map((card) => (
            <div
              key={card.title}
              className={`quick-card ${card.colorClass}`}
              onClick={() => navigate(card.path)}
            >
              <div className="quick-card-icon">{card.icon}</div>
              <h3 className="quick-card-title">{card.title}</h3>
              <p className="quick-card-desc">{card.desc}</p>
              <span className="quick-card-arrow"> Signup/Signin →</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default HomePage;
