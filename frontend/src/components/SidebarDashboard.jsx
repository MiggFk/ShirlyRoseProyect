import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  Package,
  Users,
  UserCircle,
  ArrowLeft,
  LogOut,
  Scissors,
  Menu,
  X,
} from "lucide-react";
import LogoShirly from "./LogoShirly";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const userRole = user ? user.role : null;
  const ICON_SIZE = 22;

  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/dashboard/appointments", label: "Citas", icon: <Calendar size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/dashboard/services", label: "Servicios", icon: <Scissors size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/dashboard/products", label: "Productos", icon: <Package size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    ...(userRole === "admin"
      ? [{ to: "/dashboard/users", label: "Usuarios", icon: <Users size={ICON_SIZE} className="text-rose-300 hover:text-white" /> }]
      : []),
    { to: "/profile", label: "Perfil", icon: <UserCircle size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/", label: "Volver al sitio", icon: <ArrowLeft size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa*/}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2
                   text-rose-300 hover:text-rose-400
                   transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={30} strokeWidth={2.5} /> : <Menu size={30} strokeWidth={2.5} />}
      </motion.button>

      {/* Overlay oscuro cuando el sidebar está abierto */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-40 w-64 min-h-screen p-6 flex flex-col justify-between
                       bg-white/10 backdrop-blur-2xl border-r border-white/20
                       text-white shadow-2xl"
          >
            <div>
              {/* Logo */}
              <div className="flex justify-center mb-10 mt-16">
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
                      onClick={handleLinkClick}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 transform ${
                        isActive
                          ? "bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg scale-105"
                          : "hover:bg-white/10 hover:backdrop-blur-xl hover:scale-105 hover:shadow-md"
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
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl
                           bg-rose-400 backdrop-blur-xl text-rose-800 font-medium
                           hover:bg-rose-600 hover:scale-105 hover:text-white hover:font-bold
                           shadow-lg transition-all duration-300"
              >
                <LogOut size={ICON_SIZE} />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}