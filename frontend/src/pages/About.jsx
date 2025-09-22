import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// rutas de imágenes
import founderImg from "../assets/images/SinFoto.jpg";
import trayectoriaImg from "../assets/images/SinFoto.jpg";
import empresaImg from "../assets/images/SinFoto.jpg";

export default function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    {
      title: "Nuestra Fundadora",
      text: "Shirly Rose, con más de 10 años de experiencia en estética y spa, fundó este espacio con la visión de transformar el cuidado personal en un momento de conexión y bienestar.",
      image: founderImg,
      side: "left",
    },
    {
      title: "Trayectoria",
      text: "Durante los últimos años, hemos crecido como empresa referente en estética, especializándonos en técnicas modernas de uñas, pestañas, cejas y tratamientos faciales.",
      image: trayectoriaImg,
      side: "right",
    },
    {
      title: "Sobre la Empresa",
      text: "Shirly Rose · Estética & Spa nace para ofrecer un servicio personalizado, donde cada detalle cuenta para brindar experiencias únicas de relajación y belleza.",
      image: empresaImg,
      side: "left",
    },
  ];

  const timelineItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div
      className="min-h-screen bg-rose-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      {/* Header fijo */}
      <motion.header
        className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
        {/* Botón menú hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-rose-600 hover:text-rose-800 transition z-20"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div key="close-icon" initial={{ rotate: 180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 180, scale: 0 }}><FiX size={28} /></motion.div>
            ) : (
              <motion.div key="menu-icon" initial={{ rotate: 180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 180, scale: 0 }}><FiMenu size={28} /></motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Título centrado (Great Vibes) */}
        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-3xl font-extrabold text-rose-500 italic"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Shirly Rose
        </h1>
      </motion.header>

      <AnimatePresence>
        {/* Menú lateral */}
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6"
          >
            <Link to="/" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>-----</Link>
            <Link to="/" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/products" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Productos</Link>
            <Link to="/Services" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Servicios</Link>
            <Link to="/contact" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Contacto</Link>
            <Link to="/appointment" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Agenda Cita</Link>
            <Link to="/about" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>셜리 로즈</Link>
          </motion.nav>
        )}

        {/* Overlay semi-transparente */}
        {menuOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed top-0 left-0 w-full h-full bg-black/20 z-30"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex-grow pt-24 pb-12 px-4 md:px-8 relative overflow-hidden"
      >
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
          className="text-5xl font-bold text-rose-500 text-left mb-10" 
          style={{ fontFamily: "'Zalando Sans Expanded', 'sans-serif'" }}
        >
          Sobre Shirly Rose
        </motion.h1>

        <div className="relative max-w-5xl mx-auto py-8">
          {/* Línea central con extremos */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-rose-300">
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2 w-4 h-4 bg-rose-500 z-10"></span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-2 w-4 h-4 bg-rose-500 z-10"></span>
          </div>

          <div className="space-y-16 lg:space-y-24">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center relative z-10 ${
                  section.side === "right" ? "md:justify-end" : "md:justify-start"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={timelineItemVariants}
              >
                {/* Bloque de contenido */}
                <div
                  className={`w-full md:w-1/2 flex flex-col items-center md:items-${
                    section.side === "left" ? "end" : "start"
                  }`}
                >
                  <motion.div 
                    className="w-[calc(100%-2rem)] md:w-[80%] max-w-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {section.side === "left" && (
                      <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-rose-200">
                        <h2 className="text-2xl font-bold text-rose-500 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{section.text}</p>
                      </div>
                    )}
                    {section.side === "right" && (
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-auto object-cover rounded-xl shadow-lg"
                      />
                    )}
                  </motion.div>
                </div>

                {/* Bloque de contenido opuesto */}
                <div
                  className={`w-full md:w-1/2 flex flex-col items-center md:items-${
                    section.side === "left" ? "start" : "end"
                  }`}
                >
                  <motion.div 
                    className="w-[calc(100%-2rem)] md:w-[80%] max-w-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {section.side === "left" && (
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-auto object-cover rounded-xl shadow-lg"
                      />
                    )}
                    {section.side === "right" && (
                      <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-rose-200">
                        <h2 className="text-2xl font-bold text-rose-500 mb-2">
                          {section.title}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{section.text}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="text-center py-6 bg-rose-200"
      >
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Shirly Rose · Estética & Spa
        </p>
      </motion.footer>
      </motion.div>
  );
}
