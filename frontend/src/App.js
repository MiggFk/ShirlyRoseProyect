import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Products from "./pages/Products";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Appointment from "./pages/Appointment";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Página principal pública */}
        <Route path="/" element={<Home />} />

        {/* Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Páginas públicas adicionales */}
        <Route path="/Services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/Appointment" element={<Appointment/>} />
        <Route path="/Profile" element={<Profile/>} />
        <Route path="/terms" element={<Terms />} />

        {/* Dashboard privado */}
        <Route path="/Dashboard/*" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}