import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import InputPage from "./Pages/InputPage";
import RecipePage from "./Pages/RecipePage";
import MyRecipesPage from "./Pages/MyRecipesPage";

const AUTH_STORAGE_KEY = "wimf_is_logged_in";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true"
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("user_id");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/input"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <InputPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <RecipePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myrecipes"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyRecipesPage onLogout={handleLogout} />
            </ProtectedRoute>
            
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
