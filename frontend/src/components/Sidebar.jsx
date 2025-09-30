import { Link, useLocation } from "react-router-dom";
// Importaciones de Iconos de Lucide React
import { Home, Calendar, Package, Users, UserCircle, ArrowLeft, LogOut } from "lucide-react";
import LogoShirly from "./LogoShirly"; 
import { useAuth } from "../context/AuthContext"; 


export default function Sidebar() {
  const location = useLocation();
  // ✅ OBTENEMOS user y logout DEL CONTEXTO
  const { user, logout } = useAuth(); 

  const userRole = user ? user.role : null; 
  const ICON_SIZE = 24; // Tamaño de icono uniforme para que se vean grandes

  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={ICON_SIZE} /> },
    { to: "/dashboard/appointments", label: "Citas", icon: <Calendar size={ICON_SIZE} /> },
    { to: "/dashboard/products", label: "Productos", icon: <Package size={ICON_SIZE} /> },
    
    // Renderizado condicional del enlace 'Usuarios'
    ...(userRole === "admin" 
      ? [{ to: "/dashboard/users", label: "Usuarios", icon: <Users size={ICON_SIZE} /> }]
      : []),
      
    { to: "/profile", label: "Perfil", icon: <UserCircle size={ICON_SIZE} /> },
    // Enlace para volver a la página principal del sitio
    { to: "/", label: "Volver al sitio", icon: <ArrowLeft size={ICON_SIZE} /> },
  ];

  return (
    // Contenedor principal: Usamos flex-col justify-between para empujar el botón de logout hacia abajo
    <div className="w-64 bg-gradient-to-b from-pink-500 to-purple-700 text-white min-h-screen p-6 shadow-2xl flex flex-col justify-between">
      
      <div>
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <LogoShirly size="h-24 w-24" />
        </div>

        {/* Navegación (Enlaces principales) */}
        <nav className="flex flex-col space-y-3">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                // Estilos de enlace y estado activo
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold ${
                  isActive
                    ? "bg-white text-pink-700 shadow-md" 
                    : "hover:bg-pink-400/50 hover:text-white" 
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 🟢 BOTÓN DE CERRAR SESIÓN (Aparece si hay un usuario logueado) */}
      {user && (
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-purple-900/30 text-white font-semibold hover:bg-purple-900/60 transition-colors mb-4"
        >
          <LogOut size={ICON_SIZE} />
          <span>Cerrar Sesión</span>
        </button>
      )}
    </div>
  );
}