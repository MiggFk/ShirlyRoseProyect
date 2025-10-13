import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import LogoShirly from "../../components/LogoShirly";
import { useRegister } from "../../hooks/useRegister";

export default function Register() {
  const { handleSubmit } = useRegister();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Mínimo 3 caracteres")
      .required("El nombre es obligatorio"),
    email: Yup.string()
      .email("Correo inválido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("La contraseña es obligatoria"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Confirma tu contraseña"),
    acceptedTerms: Yup.boolean()
      .oneOf([true], "Debes aceptar los términos y condiciones")
      .required("Debes aceptar los términos y condiciones"),
  });

  // Animaciones del diseño de tu compañero
  const pageVariants = {
    initial: { x: "100%" },
    animate: { x: "0%", transition: { duration: 0.7, ease: "easeOut" } },
    exit: { x: "-100%", transition: { duration: 0.7, ease: "easeIn" } },
  };

  const triangleVariants = {
    hidden: { x: "-100%" },
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
      {/* Triángulo de fondo animado */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-2/3 bg-rose-200 z-0"
        style={{ clipPath: "polygon(0% 0%, 75% 0%, 100% 100%, 0% 100%)" }}
        variants={triangleVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Icono de Home */}
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

      {/* Contenedor principal */}
      <div className="relative flex flex-col md:flex-row-reverse items-center justify-around w-full max-w-7xl mx-auto p-4 md:p-8 z-10">
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
            Crear cuenta
          </h2>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              acceptedTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    name="name"
                    type="text"
                    className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
                    placeholder="Nombre completo"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="bg-rose-200 text-rose-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

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

                <div>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 transition-colors"
                    placeholder="Confirmar contraseña"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="bg-rose-200 text-rose-700 p-2 rounded-lg mt-2 text-sm font-medium"
                  />
                </div>

                {/* Casilla de términos */}
                <div className="flex items-start space-x-2 mt-2">
                  <Field
                    type="checkbox"
                    name="acceptedTerms"
                    id="terms"
                    className="h-4 w-4 mt-1 text-rose-500 border-rose-300 rounded focus:ring-rose-400"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Acepto los{" "}
                    <Link
                      to="/terms"
                      className="text-rose-500 hover:underline cursor-pointer"
                       target="_blank"
                       rel="noopener noreferrer"
                    >
                      términos y condiciones
                    </Link>
                  </label>
                </div>
                <ErrorMessage
                  name="acceptedTerms"
                  component="div"
                  className="bg-rose-200 text-rose-700 p-2 rounded-lg text-sm font-medium"
                />

                {/* Casilla de Politicas de privacidad */}
                <div className="flex items-start space-x-2 mt-2">
                  <Field
                    type="checkbox"
                    name="acceptePoliticPrivacy"
                    id="privacy"
                    className="h-4 w-4 mt-1 text-rose-500 border-rose-300 rounded focus:ring-rose-400"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    He leído y acepto la{" "}
                    <Link
                      to="/Privacy"
                      className="text-rose-500 hover:underline cursor-pointer"
                       target="_blank"
                       rel="noopener noreferrer"
                    >
                      Politica de privacidad
                    </Link>
                  </label>
                </div>
                <ErrorMessage
                  name="acceptedPoliticadePrivacy"
                  component="div"
                  className="bg-rose-200 text-rose-700 p-2 rounded-lg text-sm font-medium"
                />

                <button
                  type="submit"
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Registrarse"
                  )}
                </button>
              </Form>
            )}
          </Formik>

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