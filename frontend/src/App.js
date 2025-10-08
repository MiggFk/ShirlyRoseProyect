import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 

// Importaciones de Páginas y Componentes
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Appointments from "./pages/dashboard/Appointments";
import Products from "./pages/dashboard/Products";
import Services from "./pages/dashboard/Services";
import Users from "./pages/dashboard/Users";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import IndexHome from "./pages/home/IndexHome";
import ServicesHome from "./pages/home/Services";
import ProductsHome from "./pages/home/Products";
import Terms from "./pages/home/Terms";
import About from "./pages/home/About";
import Privacy from "./pages/home/Privacy";
import Appointment from "./pages/home/Appointment"

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-4xl font-bold text-gray-800">404</h1>
    <p className="text-xl text-gray-600 mt-2">Página no encontrada</p>
    <Link to="/" className="mt-4 text-pink-600 hover:underline">
      Volver al inicio
    </Link>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<IndexHome />} />
          <Route path="/services" element={<ServicesHome />} />  
          <Route path="/products" element={<ProductsHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/Appointment" element={<Appointment />} />

          
          {/* Rutas de Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Perfil de usuario */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Dashboard (admin/empleado) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <Users />
                </RoleRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;




