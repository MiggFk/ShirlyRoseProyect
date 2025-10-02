import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2"; 
import { useAuth } from "../context/AuthContext"; 
import LogoShirly from "./LogoShirly"; 

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth(); 

  const publicLinks = [
    { to: "/", label: "Inicio" },
    { to: "/products", label: "Productos" },
    { to: "/services", label: "Servicios" },
    { to: "/about", label: "Nosotros" },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar Sesión?",
      text: "Tendrás que ingresar tus credenciales nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EC4899", 
      cancelButtonColor: "#9CA3AF", 
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'shadow-2xl',
        confirmButton: 'font-bold',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); 
        Swal.fire({
          icon: 'success',
          title: '¡Sesión Cerrada!',
          text: 'Has cerrado sesión exitosamente.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const ctaLink = user
    ? { 
        to: user.role === "cliente" ? "/profile" : "/dashboard", 
        label: user.role === "cliente" ? "Perfil" : "Dashboard", 
        icon: <FiUser size={20} />,
        className: "bg-pink-500 hover:bg-pink-600 text-white font-bold tracking-wide shadow-lg hover:shadow-xl"
      }
    : { 
        to: "/appointment", 
        label: "Agendar Cita", 
        className: "bg-pink-500 hover:bg-pink-600 text-white font-bold tracking-wide shadow-lg hover:shadow-xl"
      };

  const authLinks = user
    ? [
        { onClick: handleLogout, label: "Cerrar Sesión", icon: <FiLogOut size={20} />, isButton: true, className: "text-red-500 hover:text-red-700" },
      ]
    : [
        { to: "/login", label: "Iniciar Sesión", className: "text-gray-700 hover:text-rose-600" },
        { to: "/register", label: "Registrarse", className: "text-gray-700 hover:text-rose-600" },
      ];

  const handleLinkClick = () => {
      setMenuOpen(false);
  };

  return (
    <>
      {/* 1. Header Fijo (Alineación final y Glassmorphism) */}
      <motion.header
        // ✅ Mantener el estilo Glassmorphism y el padding sutil
        className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6 py-3 border-b border-rose-100" 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
        {/* Logo y Título (Alineados al centro vertical) */}
        <Link to="/" className="flex items-center gap-3">
            <LogoShirly className="h-10 w-10" /> 
            <h1
                className="text-4xl md:text-4xl font-bold text-rose-500 italic transition-colors hover:text-rose-600 leading-none"
                style={{ fontFamily: "'Great Vibes', cursive" }}
            >
                Shirly Rose
            </h1>
        </Link>
        
        {/* Botón Menú Hamburguesa */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-rose-600 hover:text-rose-800 transition z-20 p-1 rounded-full hover:bg-rose-50"
          aria-label="Abrir menú"
        >
          <FiMenu size={30} /> 
        </button>

      </motion.header>

      {/* 2. Menú lateral Desplegable (Drawer) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "100%" }} 
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, type: "spring", damping: 25, stiffness: 300 }} 
            className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col overflow-y-auto" 
          >
             {/* Header interno del menú desplegable (Mantenemos el logo y título centrado) */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 relative">
                
                {/* Botón de Cerrar (Extremo Derecho) */}
                <button
                    onClick={() => setMenuOpen(false)}
                    className="text-rose-600 hover:text-rose-800 p-1 rounded-full hover:bg-rose-50 transition absolute right-6 top-6"
                    aria-label="Cerrar menú"
                >
                    <FiX size={30} /> 
                </button>

                {/* Logo/Título (Centrado en el medio) */}
                <Link 
                    to="/" 
                    className="flex flex-col items-center justify-center w-full pt-4 pb-2" 
                    onClick={handleLinkClick}
                >
                    <LogoShirly size="h-14 w-14" /> 
                    <h1
                      className="text-3xl font-bold text-rose-500 italic mt-2" 
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Shirly Rose
                    </h1>
                </Link>
            </div>


            <div className="p-6 flex flex-col gap-5">
                {/* CTA Principal (Botón de color) */}
                <Link
                    to={ctaLink.to}
                    className={`text-center px-5 py-3 rounded-xl transition shadow-xl ${ctaLink.className}`}
                    onClick={handleLinkClick}
                >
                    {ctaLink.label}
                </Link>
                <hr className="border-rose-100 my-2" />
                
                {/* Enlaces Públicos */}
                {publicLinks.map((link) => (
                    <Link 
                        key={`mobile-${link.to}`} 
                        to={link.to} 
                        className="flex items-center gap-3 px-3 py-2 text-lg text-gray-700 hover:bg-rose-50 hover:text-rose-600 font-semibold rounded-lg transition" 
                        onClick={handleLinkClick}
                    >
                        {link.label}
                    </Link>
                ))}

                <hr className="border-rose-100 my-2" />

                {/* Enlaces de Autenticación Secundarios */}
                {authLinks.map((link, index) => (
                    link.isButton ? (
                        <button
                            key={`auth-mobile-${index}`}
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-lg text-red-500 hover:bg-red-50 font-semibold rounded-lg transition"
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </button>
                    ) : (
                        <Link
                            key={`auth-mobile-${index}`}
                            to={link.to}
                            className={`flex items-center gap-3 px-3 py-2 text-lg hover:bg-rose-50 font-semibold rounded-lg transition ${link.className}`}
                            onClick={handleLinkClick}
                        >
                            {link.label}
                        </Link>
                    )
                ))}
            </div>
          </motion.nav>
        )}

        {/* Overlay que cierra el menú */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" 
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}