import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBarPublic({ title = "Shirly Rose" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header con botón hamburguesa */}
      <motion.header
        className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
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
          {title}
        </h1>
      </motion.header>

      {/* Menú lateral */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6"
          >
            <Link to="/" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Sidebar</Link>
            <Link to="/" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/products" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Productos</Link>
            <Link to="/services" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Servicios</Link>
            <Link to="/about" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Sobre Nosotros</Link>
            <Link to="/contact" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Contacto</Link>
            <Link to="/appointment" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Agendar Cita</Link>
            <p className="text-rose-600">셜리 로즈</p>
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
