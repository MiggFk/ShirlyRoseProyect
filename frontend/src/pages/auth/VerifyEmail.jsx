import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

export default function VerifyEmail() {
  const { token } = useParams();
  const { status, message } = useVerifyEmail(token);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === "loading" && (
          <>
            <FiLoader className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verificando tu email...
            </h2>
            <p className="text-gray-600">Por favor espera un momento</p>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Email verificado!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">
              Serás redirigido al inicio de sesión...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error en la verificación
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
              >
                Ir al inicio de sesión
              </Link>
              <Link
                to="/resend-verification"
                className="block w-full border border-pink-500 text-pink-500 py-3 rounded-lg hover:bg-pink-50 transition"
              >
                Reenviar email de verificación
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}