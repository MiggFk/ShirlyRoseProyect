import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
import Logo from "./LogoShirly"; // 

export default function SidebarPublic({ title = "About" }) { //ese titulo no va, parche, era de prueba, la idea es importar el componente y ponerle el titulo que es.
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <>
      {/* HEADER */}
      <motion.header
        className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-6 py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
        {/* IZQUIERDA: Logo + nombre */}
        <div className="flex items-center gap-3">
          <Logo size="h-10 w-10" />
          <span className="font-bold text-2xl text-rose-500">ShirlyRose</span>
        </div>
        {/* CENTRO: Título dinámico */}
        <div className="flex-1 flex justify-center">
          <span className="text-2xl md:text-3xl font-extrabold text-rose-600 italic" style={{ fontFamily: "'Great Vibes', cursive" }}>
            {title}
          </span>
        </div>
        {/* DERECHA: Botón menú */}
        <button
          className="ml-auto text-rose-600 hover:text-rose-800 transition p-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
        >
          {sidebarOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </motion.header>

      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className="fixed top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-lg shadow-2xl z-[60] flex flex-col py-8 px-6 border-r border-rose-100"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="mb-10 flex items-center gap-3">
              <Logo size="h-14 w-14" />
              <span className="font-extrabold text-2xl text-rose-500">Shirly Rose</span>
            </div>
            <nav className="flex flex-col gap-4">
              {publicLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-lg font-semibold text-gray-700 hover:text-rose-600 transition px-2 py-2 rounded hover:bg-rose-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={ctaLink.to}
                className={`mt-4 flex items-center gap-2 justify-center rounded-xl py-2 px-4 ${ctaLink.className}`}
                onClick={() => setSidebarOpen(false)}
              >
                {ctaLink.icon}
                {ctaLink.label}
              </Link>
            </nav>
            <div className="mt-auto flex flex-col gap-2">
              {authLinks.map((link, i) =>
                link.isButton ? (
                  <button
                    key={i}
                    onClick={link.onClick}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded ${link.className}`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${link.className}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Espacio para el contenido debajo del header */}
      <div className="pt-20"></div>
    </>
  );
}