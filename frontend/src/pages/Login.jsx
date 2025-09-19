import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiHome } from "react-icons/fi"; // 👈 importamos el icono

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-rose-100">
      {/* 🔹 Icono de Home arriba a la izquierda */}
      <Link
  to="/"
  title="Volver al inicio"
  className="absolute top-4 left-4 text-rose-600 hover:text-rose-800 transition"
>
  <FiHome size={28} />
</Link>


      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-rose-600 drop-shadow-sm">
          Inicia sesión
        </h2>

        {error && (
          <div className="bg-rose-200 text-rose-700 p-3 rounded-lg mb-4 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-semibold transition shadow"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-rose-500 font-medium hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
