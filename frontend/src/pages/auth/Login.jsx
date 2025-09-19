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

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* 🔹 Icono de Home */}
      <Link
        to="/"
        title="Volver al inicio"
        className="absolute top-6 left-6 text-pink-600 hover:text-pink-800 transition-colors"
      >
        <FiHome size={32} />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md"
      >
        <div className="flex justify-center mb-6">
          <LogoShirly size="h-24 w-24" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Inicia sesión
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Ingresa tus credenciales para continuar
        </p>

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
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  placeholder="Correo electrónico"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  placeholder="Contraseña"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold transition shadow-lg flex justify-center items-center gap-2
                  ${isSubmitting ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600 text-white"}
                `}
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
            className="text-pink-600 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
