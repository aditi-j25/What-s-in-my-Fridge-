import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import InputsPage from "./Pages/InputPage.jsx";
import RecipePage from "./Pages/RecipePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="InputPage" element={<InputsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;