import { useState, useEffect } from "react";
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
  ShoppingCart,
} from "lucide-react";
import Swal from "sweetalert2";
import LogoShirly from "./LogoShirly";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const userRole = user ? user.role : null;
  const ICON_SIZE = 22;

  // El sidebar NO se abre automáticamente en pantallas grandes, se mantiene controlado
  // por el botón hamburguesa en todas las resoluciones
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Mantenerlo cerrado hasta que el usuario lo abra manualmente
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { to: "/dashboard", label: "Inicio", icon: <Home size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/dashboard/appointments", label: "Citas", icon: <Calendar size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/dashboard/services", label: "Servicios", icon: <Scissors size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/dashboard/products", label: "Productos", icon: <Package size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    ...(userRole === "admin"
      ? [{ to: "/dashboard/users", label: "Usuarios", icon: <Users size={ICON_SIZE} className="text-rose-300 hover:text-white" /> }]
      : []),
    { to: "/dashboard/cart", label: "Carrito", icon: <ShoppingCart size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/profile", label: "Perfil", icon: <UserCircle size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
    { to: "/", label: "Volver al sitio", icon: <ArrowLeft size={ICON_SIZE} className="text-rose-300 hover:text-white" /> },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          icon: "success",
          confirmButtonColor: "#e11d48",
        });
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      {/* Botón hamburguesa (en todas las resoluciones) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-5 z-50 p-2 text-rose-400 hover:text-rose-500 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
      </motion.button>

      {/* Overlay oscuro solo visible en pantallas pequeñas */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
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
            className="fixed left-0 top-0 z-40 w-64 h-full p-6 flex flex-col justify-between
                       bg-white/10 backdrop-blur-2xl border-r border-white/20
                       text-white shadow-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-transparent"
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
                onClick={handleLogout}
                className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl
                           bg-rose-400 backdrop-blur-xl border border-white/20 text-rose-800 font-medium
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
