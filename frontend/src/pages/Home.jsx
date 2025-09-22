import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../assets/logos/Logo-ShirlyRose.png";

// imágenes de servicios
import LimpiezaFac from "../assets/images/services/EsteticaFacial/LimpiezaFacialPremium.png";
import Pestañas from "../assets/images/services/CejasyPestañas/PestañasHome.jpg";
import Manicure from "../assets/images/services/Uñas/Manicure.jpg";

// imágenes de productos
import Aceites from "../assets/images/products/aceite.jpg";
import Cremas from "../assets/images/products/exfoliante.jpg";
import Shampoo from "../assets/images/products/shampoo.jpg";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-rose-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      {/* Header */}
      <motion.header
        className="flex justify-between items-center px-6 py-4 shadow-md bg-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
        {/* Logo + nombre */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo Shirly Rose"
              className="h-14 w-14 object-contain"
            />
          </Link>
          <h1 className="text-3xl text-gray-600" style={{ fontFamily: "'Great Vibes', cursive" }}>Shirly Rose</h1>
        </div>

        {/* Navegación header*/}
        <nav className="hidden md:flex gap-6">
          <Link to="/services" className="text-gray-700 hover:text-rose-500 font-medium transition">Servicios</Link>
          <Link to="/products" className="text-gray-700 hover:text-rose-500 font-medium transition">Productos</Link>
          <Link to="/about" className="text-gray-700 hover:text-rose-500 font-medium transition">Nosotros</Link>
        </nav>

        {/* Botones */}
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-sm bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
          >
            Registrarse
          </Link>
        </div>
      </motion.header>

      {/* Hero principal */}
      <motion.section
        className="flex flex-col items-center text-center py-16 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } }}
      >
        <h2 className="text-4xl md:text-6xl text-rose-500 mb-4 italic" style={{ fontFamily: "'Great Vibes', cursive" }}>
          Bienvenido a
        </h2>
        <h2 className="text-4xl md:text-7xl font-extrabold text-rose-500 mb-4 italic" style={{ fontFamily: "'Great Vibes', cursive" }}>
          Shirly Rose...
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Relájate, cuida tu piel y luce espectacular con nuestros servicios de
          estética, spa y peluqueria. Aquí podrás reservar tu cita fácilmente.
        </p>
        <Link
          to="/appointment"
          className="px-8 py-3 rounded-xl bg-rose-400 text-white font-semibold shadow hover:bg-rose-500 transition duration-200"
        >
          Agenda tu cita
        </Link>
      </motion.section>

      {/* Sección de Servicios */}
      <section className="py-12 px-6 bg-white">
        <h3 className="text-2xl font-bold text-rose-500 text-center mb-8">
          Servicios Destacados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <img src={Pestañas} alt="Cejas y Pestañas" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">Cejas y Pestañas</h4>
              <p className="text-gray-600">
                Cejas y pestañas con el estilo que desees y el mejor procedimiento.
              </p>
              <Link
                to="/services"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <img src={LimpiezaFac} alt="Limpieza Facial" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">Spa - Limpiezas Faciales</h4>
              <p className="text-gray-600">
                Relaja tu piel y luce impecable.
              </p>
              <Link
                to="/services"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <img src={Manicure} alt="Manicure" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">Manicure y Pedicure</h4>
              <p className="text-gray-600">
                Uñas manos y pies.
              </p>
              <Link
                to="/services"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sección de Productos */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold text-rose-500 text-center mb-8">
          Productos Destacados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <img src={Cremas} alt="Cremas" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">Exfoliante</h4>
              <p className="text-gray-600">Nutrición intensa para tu piel.</p>
              <Link
                to="/products"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <img src={Aceites} alt="Aceites" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">Aceites Naturales</h4>
              <p className="text-gray-600">Aromaterapia y cuidado natural.</p>
              <Link
                to="/products"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <img src={Shampoo} alt="Shampoo" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">Shampoo Orgánico</h4>
              <p className="text-gray-600">Frescura y brillo para tu cabello.</p>
              <Link
                to="/products"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="text-center py-6 bg-rose-200 mt-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
      >
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Shirly Rose · Estética & Spa
        </p>
      </motion.footer>
    </motion.div>
  );
}