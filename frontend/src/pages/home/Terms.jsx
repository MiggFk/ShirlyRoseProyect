import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { motion } from "framer-motion";
import bgImage from "../..assets/images/paloRosa.png";

export default function Terms() {
  return (
    <motion.div
      className="min-h-screen relative flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Capa oscura para contraste */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Botón Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-white hover:text-rose-300 transition z-10"
        title="Volver al inicio"
      >
        <FiHome size={30} />
      </Link>

      {/* Contenedor de términos */}
      <motion.div
        className="relative max-w-3xl w-full p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/30 text-white z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.8 } }}
      >
        <h1 className="text-3xl font-bold text-rose-300 mb-6 text-center">
          Términos y Condiciones
        </h1>

        <p className="text-gray-100 leading-relaxed mb-4">
          Bienvenido a nuestro sitio web. Al registrarte y utilizar nuestros
          servicios, aceptas los siguientes términos y condiciones. Por favor,
          léelos detenidamente antes de continuar.
        </p>

        <h2 className="text-xl font-semibold text-rose-300 mt-6 mb-2">
          1. Uso del servicio
        </h2>
        <p className="text-gray-100 leading-relaxed mb-4">
          Solo podrás utilizar nuestra plataforma para fines legales y
          personales. No se permite el uso indebido ni actividades que puedan
          dañar el servicio o a otros usuarios.
        </p>

        <h2 className="text-xl font-semibold text-rose-300 mt-6 mb-2">
          2. Privacidad
        </h2>
        <p className="text-gray-100 leading-relaxed mb-4">
          Nos comprometemos a proteger tu información personal. Consulta nuestra
          política de privacidad para conocer cómo manejamos tus datos.
        </p>

        <h2 className="text-xl font-semibold text-rose-300 mt-6 mb-2">
          3. Modificaciones
        </h2>
        <p className="text-gray-100 leading-relaxed mb-4">
          Nos reservamos el derecho de modificar los términos en cualquier
          momento. Te notificaremos sobre los cambios a través del sitio web.
        </p>

        <p className="text-gray-200 mt-8 text-sm text-center">
          Última actualización: Septiembre 2025
        </p>

        <div className="flex justify-center mt-6">
          <Link
            to="/register"
            className="bg-rose-500/80 hover:bg-rose-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Volver al Registro
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}