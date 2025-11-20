import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import FieldInspectionApp from "./pages/FieldInspectionApp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<FieldInspectionApp />} />
      </Routes>
    </div>
  );
}

export default App;
