import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

function LoginPage({ setIsLoggedIn }) {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // temporary: just log values
        console.log("Email:", email);
        console.log("Password:", password);
        setIsLoggedIn(true);
        
        // navigate("/dashboard"); // navigate to logged in dashboard
        navigate("/home");
    };

    return (
        <div className="loginpage">
    
          {/* ── Navbar ── */}
          <nav className="navbar">
            <div className="navbar-logo">
    
              <span className="logo-text">WHAT'S IN MY FRIDGE?</span>
            </div>
          </nav>
    
          {/* ── Login Box── */}
          <section className="login">
            <div className="login-content">
              <h1 className="login-heading">Login</h1>
              <form className="login-form" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label>Don't have an account? {"  "}
                    <Link to="/signup" className="login-text">Sign up here</Link>
                </label>
                <button className="login-btn" type="submit">
                    Login
                </button>
              </form>
            </div>
          </section>
        </div>
      );
    }
    
    export default LoginPage;