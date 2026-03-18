import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;