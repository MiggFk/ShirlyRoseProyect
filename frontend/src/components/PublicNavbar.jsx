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

  // Enlaces públicos
  const publicLinks = [
    { to: "/", label: "Inicio" },
    { to: "/products", label: "Productos" },
    { to: "/services", label: "Servicios" },
    { to: "/about", label: "Nosotros" },
    { to: "/contact", label: "Contacto" },
    { to: "/appointment", label: "Agenda Cita"}
  ];

  // Lógica de cierre de sesión
  const handleLogout = () => {
  Swal.fire({
    title: "¿Cerrar Sesión?",
    text: "Tendrás que ingresar tus credenciales nuevamente.",
    icon: "warning",
    iconColor: "#ff7c8e",         // color del ícono
    background: "#fffafc",        // fondo rosado claro
    color: "#4b4b4b",             // color del texto principal
    showCancelButton: true,
    confirmButtonColor: "#ff7c8e", // botón confirmar (rosa medio)
    cancelButtonColor: "#ff4c64",  // botón cancelar (rosa intenso)
    confirmButtonText: "Sí, cerrar sesión",
    cancelButtonText: "Cancelar",
    customClass: {
      popup: "shadow-2xl rounded-2xl", // sombra + bordes suaves
      title: "text-2xl font-semibold text-rose-500",
      confirmButton: "font-semibold tracking-wide px-5 py-2 rounded-lg",
      cancelButton: "font-semibold tracking-wide px-5 py-2 rounded-lg",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
      Swal.fire({
        icon: "success",
        title: "¡Sesión Cerrada!",
        text: "Has cerrado sesión exitosamente.",
        iconColor: "#ff7c8e",
        background: "#fffafc",
        color: "#4b4b4b",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
};

  // CTA principal
  const ctaLink = user
    ? {
        to: user.role === "cliente" ? "/profile" : "/dashboard",
        label: user.role === "cliente" ? "Perfil" : "Dashboard",
        icon: <FiUser size={20} />,
        className:
          "bg-rose-400 hover:bg-rose-500 text-white font-bold tracking-wide shadow-lg hover:shadow-xl",
      }
    : {
        to: "/appointment",
        label: "Agendar Cita",
        className:
          "bg-rose-400 hover:bg-rose-500 text-white font-bold tracking-wide shadow-lg hover:shadow-xl",
      };

  // Enlaces de autenticación
  const authLinks = user
    ? [
        {
          onClick: handleLogout,
          label: "Cerrar Sesión",
          icon: <FiLogOut size={20} />,
          isButton: true,
          className: "text-red-500 hover:text-red-700",
        },
      ]
    : [
        {
          to: "/login",
          label: "Iniciar Sesión",
          className: "text-gray-700 hover:text-rose-500",
        },
        {
          to: "/register",
          label: "Registrarse",
          className: "text-gray-700 hover:text-rose-500",
        },
      ];

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      {/* Header principal con botón hamburguesa */}
      <motion.header
        className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.5, delay: 0.2 },
        }}
      >
        {/* Botón menú (abre sidebar) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-rose-600 hover:text-rose-800 transition z-20"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
              >
                <FiX size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu-icon"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
              >
                <FiMenu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Título centrado */}
        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-3xl font-extrabold text-rose-500 italic"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Shirly Rose
        </h1>
      </motion.header>

      {/* Sidebar (menú lateral izquierdo) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-14 left-0 h-[calc(100%-3.5rem)] w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6 overflow-y-auto"
          >
            {/* Logo y botón CTA */}
            <div className="flex flex-col items-center justify-center gap-2">
              <Link
                to="/"
                className="flex flex-col items-center gap-2"
                onClick={handleLinkClick}
              >
                <LogoShirly className="h-16 w-16" />
                <span
                  className="text-xl font-normal text-gray-700 italic text-center"
                >
                  Shirly Rose
                </span>
              </Link>

              <Link
                to={ctaLink.to}
                className={`text-center px-5 py-3 rounded-xl transition ${ctaLink.className}`}
                onClick={handleLinkClick}
              >
                {ctaLink.label}
              </Link>
            </div>

            {/* Enlaces principales */}
            <hr className="border-rose-100" />
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-rose-400 transition text-lg"
                onClick={handleLinkClick}
              >
                {link.label}
              </Link>
            ))}

            {/* Enlaces de autenticación */}
            <hr className="border-rose-100" />
            {authLinks.map((link, index) =>
              link.isButton ? (
                <button
                  key={`auth-${index}`}
                  onClick={link.onClick}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 text-lg font-semibold transition"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ) : (
                <Link
                  key={`auth-${index}`}
                  to={link.to}
                  className={`text-lg font-normal transition ${link.className}`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Texto japonés decorativo */}
            <p className="mt-auto text-rose-500 text-center font-bold">
              셜리 로즈
            </p>
          </motion.nav>
        )}

        {/* Overlay oscuro */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
