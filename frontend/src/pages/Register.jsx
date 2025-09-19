import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiHome } from "react-icons/fi";
import { motion } from "framer-motion";
import Logo from '../components/Logo.jsx';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  const pageVariants = {
    initial: { x: "100%" },
    animate: { x: "0%", transition: { duration: 0.7, ease: "easeOut" } },
    exit: { x: "-100%", transition: { duration: 0.7, ease: "easeIn" } }
  };

  const triangleVariants = {
    hidden: { x: "-100%" },
    visible: {
      x: "0%",
      transition: { type: "spring", stiffness: 50, damping: 15, duration: 1.5, delay: 0.2},
    },
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 1.2 } },
  };

  const logoContainerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.8 } },
  };

  return (
    <motion.div
      className="relative flex items-center justify-center min-h-screen bg-rose-100 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* 🔹 Triángulo de fondo animado (invertido) */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-2/3 bg-rose-200 z-0"
        style={{ clipPath: "polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)" }}
        variants={triangleVariants}
        initial="hidden"
        animate="visible"
      />

      {/* 🔹 Icono de Home animado */}
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="absolute right-8 top-8 text-rose-600 hover:text-rose-800 transition z-20"
      >
        <Link to="/" title="Volver al inicio">
          <FiHome size={32} />
        </Link>
      </motion.div>

      {/* 🔹 Contenedor principal de registro */}
      <div className="relative flex flex-col md:flex-row-reverse items-center justify-around w-full max-w-7xl mx-auto p-4 md:p-8 z-10">
        {/* 🔹 Sección del logo */}
        <motion.div
          className="flex justify-center items-center p-8 md:p-12 mb-8 md:mb-0"
          variants={logoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <Logo size="h-64 w-64 md:h-80 md:w-80 object-contain" />
        </motion.div>

        {/* 🔹 Sección del formulario */}
        <motion.div
          className="w-full max-w-md p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold text-center mb-6 text-rose-600 drop-shadow-sm">
            Crear cuenta
          </h2>

          {error && (
            <div className="bg-rose-200 text-rose-700 p-3 rounded-lg mb-4 text-center text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
              required
            />

            <button
              type="submit"
              className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Registrarse
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-rose-500 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}