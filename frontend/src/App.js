import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { Link } from "react-router-dom";

// Componente para manejar las rutas no encontradas
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
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<IndexHome />} />
        <Route path="/servicesHome" element={<ServicesHome />} />
        <Route path="/productsHome" element={<ProductsHome />} />
        
        {/* Rutas de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta del perfil del usuario (clientes, empleados, admin) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Rutas Privadas / Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Rutas anidadas que se renderizan dentro de DashboardLayout */}
          <Route index element={<Home />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="products" element={<Products />} />
          <Route
            path="users"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Users />
              </RoleRoute>
            }
          />
          <Route path="services" element={<Services />} />
        </Route>

        {/* Ruta comodín para capturar URLs no válidas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
