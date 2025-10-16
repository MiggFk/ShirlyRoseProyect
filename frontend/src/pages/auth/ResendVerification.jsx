import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useResendVerification } from '../../hooks/useResendVerification';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const { resendVerification, loading } = useResendVerification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await resendVerification(email);
    
    if (result.success) {
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <FiMail className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">
            Reenviar verificación
          </h2>
          <p className="text-gray-600 mt-2">
            Ingresa tu email para recibir un nuevo enlace de verificación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Reenviar email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 transition"
          >
            <FiArrowLeft />
            Volver al inicio de sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
}