import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Home from "./pages/dashboard/Home";
import Appointments from "./pages/dashboard/Appointments";
import Products from "./pages/dashboard/Products";
import Users from "./pages/dashboard/Users";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import IndexHome from "./pages/home/IndexHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["admin", "empleado"]}>
              <DashboardLayout />
              </RoleRoute>
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
