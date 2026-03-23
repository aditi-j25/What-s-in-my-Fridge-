import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PiChefHatFill } from "react-icons/pi";
import "./SignupPage.css";
// from DbConnect import insert_user;

function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // new state
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("**Passwords do not match**");
            return;
        }
        const res = await fetch("https://what-s-in-my-fridge-gop7.onrender.com/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
          }),
        });

        const data = await res.json();

        if (data.error) {
          alert(data.error);
        } else {
          navigate("/login");
        }
      };

    return (
        <div className="signuppage">
    
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
              <button className="nav-profile" onClick={() => navigate("/login")}>
                <PiChefHatFill /> Login
              </button>
            </div>
          </nav>
    
          {/* ── Login Box── */}
          <section className="signup">
            <div className="signup-content">
              <h1 className="signup-heading">Sign Up</h1>
              <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                />
                <label>{error && <p className="error-text">{error}</p>}</label>

                <button className="signup-btn" type="submit">
                    Sign Up
                </button>
                <label>Already have an account? {"  "}
                    <Link to="/login" className="login-text">Login</Link>
                </label>
              </form>
            </div>
          </section>
        </div>
      );
    }
    
    export default SignupPage;
