import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiHome } from "react-icons/fi"; // ✅ Importar icono de Home

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
        navigate("/login"); // redirige al login al registrar correctamente
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-rose-100">
      {/* ✅ Icono Home en la esquina */}
      <Link
  to="/"
  title="Volver al inicio"
  className="absolute top-4 left-4 text-rose-600 hover:text-rose-800 transition"
>
  <FiHome size={28} />
</Link>


      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-6 drop-shadow-sm">
          Crear cuenta
        </h2>

        {error && (
          <p className="bg-rose-200 text-rose-700 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            required
          />

          <button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-semibold transition shadow"
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
      </div>
    </div>
  );
}
