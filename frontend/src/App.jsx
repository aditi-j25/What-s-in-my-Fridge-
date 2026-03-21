import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import InputPage from "./Pages/InputPage.jsx";
import RecipePage from "./Pages/RecipePage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/InputPage" element={<InputPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;