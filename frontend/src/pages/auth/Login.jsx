import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import LogoShirly from "../../components/LogoShirly";
import { useLogin } from "../../hooks/useLogin";

export default function Login() {
  const { handleSubmit } = useLogin();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
  });

  // Animaciones del diseño de tu compañero
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

      {/* Contenedor principal de login */}
      <div className="relative flex flex-col md:flex-row items-center justify-around w-full max-w-7xl mx-auto p-4 md:p-8 z-10">
        {/* Sección del logo */}
        <motion.div
          className="flex justify-center items-center p-8 md:p-12 mb-8 md:mb-0"
          variants={logoContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <LogoShirly size="h-64 w-64 md:h-80 md:w-80" />
        </motion.div>

        {/* Sección del formulario con Formik */}
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
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    name="email"
                    type="email"
                    className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
                    placeholder="Correo electrónico"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="bg-rose-200 text-rose-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                <div>
                  <Field
                    name="password"
                    type="password"
                    className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
                    placeholder="Contraseña"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="bg-rose-200 text-rose-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Ingresar"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center text-sm mt-6 text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-rose-500 font-medium hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}