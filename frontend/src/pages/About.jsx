import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Imágenes
import founderImg from "../assets/images/Fundadora.jpg";
import trayectoriaImg from "../assets/images/Girl.jpg";
import empresaImg from "../assets/images/manos.jpg";
import ValoresImg from "../assets/images/Fondo-Mujer.png";
import VisionImg from "../assets/images/fondo-rosas-claras.png";
import Footer from "../components/Footer";

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
    {
      title: "Nuestros Valores",
      text: "Trabajamos con pasión, dedicación y un compromiso constante con la excelencia para que cada cliente viva una experiencia única y enriquecedora.",
      image: ValoresImg,
      side: "right",
    },
    {
      title: "Misión y Visión",
      text: "Nuestra misión es ofrecer bienestar y cuidado integral; nuestra visión es convertirnos en un referente nacional de servicios estéticos y spa.",
      image: VisionImg,
      side: "left",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-rose-50"
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
            <Link to="/" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>----</Link>
            <Link to="/" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/products" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Productos</Link>
            <Link to="/services" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Servicios</Link>
            <Link to="/contact" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Contacto</Link>
            <Link to="/appointment" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Agendar Cita</Link>
            <Link to="" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>셜리 로즈</Link>
          </motion.nav>
        )}

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

      {/* Contenido */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pt-24"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
          className="text-5xl font-bold text-rose-500 text-center mb-12"
        >
          Sobre Shirly Rose
        </motion.h1>

        <div className="space-y-24">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className={`flex flex-col md:flex-row ${
                section.side === "left" ? "" : "md:flex-row-reverse"
              } items-center`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeIn}
            >
              {/* Imagen */}
              <div className="w-full md:w-2/2 h-90">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Texto */}
              <div className="w-full md:w-1/2 p-9">
                <h2 className="text-3xl font-bold text-rose-600 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {section.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.main>

      {/* Footer */}
      <div className="mt-10">
      <motion.footer
        className="text-center py-6 bg-rose-200 mt-auto mt-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
      >
        <Footer />
      </motion.footer>
      </div>
    </motion.div>
  );
}
