import { motion } from "framer-motion";
import { FiLogOut, FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import Swal from "sweetalert2";
import { Home } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró el token de autenticación.");
        }
        
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.profile);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudo cargar el perfil. Intenta iniciar sesión nuevamente.',
        }).then(() => {
          navigate("/login");
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres cerrar tu sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h2 className="text-xl font-semibold text-gray-700">No se pudo cargar la información del usuario.</h2>
        <button
          onClick={handleLogout}
          className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold transition"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-4">
      <Link
        to="/dashboard"
        title="Volver al dashboard"
        className="absolute top-6 left-6 text-pink-600 hover:text-pink-800 transition-colors"
      >
        <Home size={32} />
      </Link>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center"
      >
        <div className="flex justify-center mb-6">
          <FiUser className="text-pink-500" size={80} />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Perfil del Usuario
        </h2>
        
        <div className="space-y-3 text-left my-6">
          <p className="font-semibold text-gray-700">
            <span className="block text-sm text-gray-500">Nombre:</span>
            {user.name}
          </p>
          <p className="font-semibold text-gray-700">
            <span className="block text-sm text-gray-500">Correo:</span>
            {user.email}
          </p>
          <p className="font-semibold text-gray-700">
            <span className="block text-sm text-gray-500">Rol:</span>
            <span className="font-medium capitalize">{user.role}</span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
        >
          <FiLogOut size={20} />
          Cerrar sesión
        </button>
      </motion.div>
    </div>
  );
}
