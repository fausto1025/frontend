import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./modules/auth/pages/Login";
import RegistroForm from "./modules/attendance/pages/RegistroForm";
import Dashboard from "./modules/user/pages/Dashboard";


function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Página de login */}
        <Route path="/login" element={<Login />} />

        {/* Página pública de registro */}
        <Route path="/registro" element={<RegistroForm />} />

        {/* Página de usuario (protegida) */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
