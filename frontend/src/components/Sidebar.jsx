import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Package, Users, UserCircle, ArrowLeft } from "lucide-react";
import LogoShirly from "./LogoShirly"; 
// ✅ IMPORTA el nuevo hook useAuth
import { useAuth } from "../hooks/useAuth"; // Asegúrate de que la ruta sea correcta

// ❌ Se ELIMINA el hook useAuth simulado que estaba aquí

export default function Sidebar() {
  const location = useLocation();
  // ✅ Llama al hook useAuth importado
  const { user } = useAuth(); 

  // ⚠️ Importante: Verifica que 'user' no sea null antes de acceder a 'user.role'
  const userRole = user ? user.role : null; 

  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={18} /> },
    { to: "/dashboard/appointments", label: "Citas", icon: <Calendar size={18} /> },
    { to: "/dashboard/products", label: "Productos", icon: <Package size={18} /> },
    // 🔹 Muestra el enlace de "Usuarios" solo si el rol es 'admin'
    ...(userRole === "admin" 
      ? [{ to: "/dashboard/users", label: "Usuarios", icon: <Users size={18} /> }]
      : []),
    { to: "/profile", label: "Perfil", icon: <UserCircle size={18} /> },
    { to: "/", label: "Volver al sitio", icon: <ArrowLeft size={18} /> },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-pink-500 to-purple-700 text-white min-h-screen p-6 shadow-lg">
      {/* ... (Resto del código sin cambios) ... */}
      <div className="flex justify-center mb-10">
        <LogoShirly size="h-20 w-20" />
      </div>

      <nav className="flex flex-col space-y-3">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-4 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-pink-600 border-l-4 border-pink-400"
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