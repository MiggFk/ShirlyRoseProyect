import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Package, Users } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={18} /> },
    { to: "/dashboard/appointments", label: "Citas", icon: <Calendar size={18} /> },
    { to: "/dashboard/products", label: "Productos", icon: <Package size={18} /> },
    { to: "/dashboard/users", label: "Usuarios", icon: <Users size={18} /> },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-pink-500 to-purple-700 text-white min-h-screen p-6 shadow-lg">
      {/* Logo / Marca */}
      <h2 className="text-3xl font-extrabold mb-10 text-center tracking-wide">
        Shirly <span className="text-pink-200">Rose</span>
      </h2>

      {/* Navegación */}
      <nav className="flex flex-col space-y-3">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-pink-600 text-white shadow-md"
                  : "hover:bg-pink-400/30"
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
