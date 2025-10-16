import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import LogoShirly from "../../components/LogoShirly";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, isLoading } = useLogin();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  // Animaciones
  const pageVariants = {
    initial: { x: "-100%" },
    animate: { x: "0%", transition: { duration: 0.7, ease: "easeOut" } },
    exit: { x: "100%", transition: { duration: 0.7, ease: "easeIn" } }
  };

  const triangleVariants = {
    hidden: { x: "100%" },
    visible: {
      x: "0%",
      transition: { type: "spring", stiffness: 50, damping: 15, duration: 1.5, delay: 0.2 },
    },
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, delay: 1.2 } },
  };

  const logoContainerVariants = {
    hidden: { opacity: 0, x: -50 },
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
      {/* Triángulo de fondo animado */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-2/3 bg-rose-200 z-0"
        style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        variants={triangleVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Icono de Home animado */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="absolute top-8 left-8 text-rose-600 hover:text-rose-800 transition z-20"
      >
        <Link to="/" title="Volver al inicio">
          <FiHome size={32} />
        </Link>
      </motion.div>

      {/* Contenedor principal */}
      <div className="relative flex flex-col md:flex-row items-center justify-around w-full max-w-7xl mx-auto p-4 md:p-8 z-10">
        {/* Logo */}
        <motion.div
          className="flex justify-center items-center p-8 md:p-12 mb-8 md:mb-0"
          variants={logoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <LogoShirly size="h-64 w-64 md:h-80 md:w-80" />
        </motion.div>

        {/* Formulario con Formik */}
        <motion.div
          className="w-full max-w-md p-6 md:p-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold text-center mb-6 text-rose-600 drop-shadow-sm">
            Inicia sesión
          </h2>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Field
                      type="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="bg-rose-200 text-rose-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="bg-rose-200 text-rose-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Botón */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>

          <p className="text-center text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-pink-500 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <p className="text-center text-gray-600 mt-2">
            <Link to="/forgot-password" className="text-purple-500 font-semibold hover:underline text-sm">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}