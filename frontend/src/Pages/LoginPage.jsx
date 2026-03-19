import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";
// from DBConnect get_user;

function LoginPage({ setIsLoggedIn }) {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        // user_data = get_user(username)

        // check if user and password match in backend
        // if (user_data) {
        //   if (password == user_data.password) {
        //     setIsLoggedIn(true);
        //     navigate("/dashboard")
        //   } else {
        //     setError("**Invalid login**");
        //     return;
        //   }

        //  } else {
        // setError("**Invalid login**");
        // return;
        //  }
        
        
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
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                <label>{error && <p className="error-text">{error}</p>}</label>
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