import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";

export default function VerifyEmail() {
  const { status, message } = useVerifyEmail();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/50"
      >
        <div className="text-center">
          {status === "loading" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 size={64} className="text-pink-500" />
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <CheckCircle size={64} className="text-green-500 mx-auto" />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-4"
            >
              <XCircle size={64} className="text-red-500 mx-auto" />
            </motion.div>
          )}

          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            {status === "loading" && "Verificando tu email..."}
            {status === "success" && "¡Email verificado!"}
            {status === "error" && "Error de verificación"}
          </h1>

          <p className="text-gray-700 mb-6">{message}</p>

          {status === "success" && (
            <p className="text-sm text-gray-600 mb-4">
              Serás redirigido al login en 3 segundos...
            </p>
          )}

          {status === "error" && (
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Volver al login
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}