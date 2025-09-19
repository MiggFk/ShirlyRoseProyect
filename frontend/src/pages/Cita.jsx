import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Cita() {
  const [nombre, setNombre] = useState("");
  const [hora, setHora] = useState("");
  const [servicio, setServicio] = useState("");
  const [producto, setProducto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para agendar la cita
    console.log("Cita agendada:", { nombre, hora, servicio, producto });
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.7, ease: "easeIn" } }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen bg-rose-100 p-4 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* 🔹 Icono de Home */}
      <Link
        to="/"
        title="Volver al inicio"
        className="absolute top-8 left-8 text-rose-600 hover:text-rose-800 transition z-20"
      >
        <FiHome size={32} />
      </Link>

      {/* 🔹 Contenedor del formulario */}
      <motion.div
        className="w-full max-w-md p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
      >
        <h2 className="text-4xl font-bold text-center mb-6 text-rose-600 drop-shadow-sm">
          Agendar Cita
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Hora"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Servicio"
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Producto"
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
            required
          />
          <button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Agendar
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}