import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  Package,
  Users,
  UserCircle,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import LogoShirly from "./LogoShirly";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const userRole = user ? user.role : null;
  const ICON_SIZE = 22;

  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={ICON_SIZE} className="text-rose-700" /> },
    { to: "/dashboard/appointments", label: "Citas", icon: <Calendar size={ICON_SIZE} className="text-rose-700"/> },
    { to: "/dashboard/products", label: "Productos", icon: <Package size={ICON_SIZE} className="text-rose-700"/> },

    ...(userRole === "admin"
      ? [{ to: "/dashboard/users", label: "Usuarios", icon: <Users size={ICON_SIZE} className="text-rose-700"/> }]
      : []),

    { to: "/profile", label: "Perfil", icon: <UserCircle size={ICON_SIZE} className="text-rose-700"/> },
    { to: "/", label: "Volver al sitio", icon: <ArrowLeft size={ICON_SIZE} className="text-rose-700"/> },
  ];

  return (
    <div className="w-64 bg-rose-300 text-white min-h-screen p-6 shadow-xl flex flex-col justify-between animate-slideIn">
      <div>
        {/* Logo */}
        <div className="flex justify-center mb-10 animate-fadeIn">
          <LogoShirly size="h-24 w-24" />
        </div>

        {/* Navegación */}
        <nav className="flex flex-col space-y-3">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-300 transform ${
                  isActive
                    ? "bg-white text-rose-700 shadow-md scale-105"
                    : "hover:bg-rose-200 hover:scale-105 hover:shadow-lg"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Botón Cerrar Sesión */}
      {user && (
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-700 hover:scale-105 transition-all duration-300"
        >
          <LogOut size={ICON_SIZE} />
          <span>Cerrar Sesión</span>
        </button>
      )}
    </div>
  );
}
