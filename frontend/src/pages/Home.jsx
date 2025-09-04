import { Link } from "react-router-dom";
import Logo from "../assets/logos/Logo-ShirlyRose.jpg";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-rose-100">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        {/* Logo + nombre */}
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Logo Shirly Rose"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-bold text-rose-500">Shirly Rose</h1>
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex gap-6">
          <Link
            to="/services"
            className="text-gray-700 hover:text-rose-500 font-medium transition"
          >
            Servicios
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-rose-500 font-medium transition"
          >
            Productos
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-rose-500 font-medium transition"
          >
            Nosotros
          </Link>
        </nav>

        {/* Botones */}
        <div className="flex gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-sm bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero principal */}
      <section className="flex flex-col items-center text-center py-16 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-rose-500 mb-4">
          SHIRLY ROSE
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Relájate, cuida tu piel y luce espectacular con nuestros servicios de
          estética y spa. Aquí podrás reservar tu cita fácilmente.
        </p>
        <Link
          to="/appointments"
          className="px-8 py-3 rounded-xl bg-rose-400 text-white font-semibold shadow hover:bg-rose-500 transition duration-200"
        >
          Agenda tu cita
        </Link>
      </section>

      {/* Sección de Servicios */}
      <section className="py-12 px-6 bg-white">
        <h3 className="text-2xl font-bold text-rose-500 text-center mb-8">
          Nuestros Servicios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-rose-400 mb-2">
              Masajes Relajantes
            </h4>
            <p className="text-gray-600">
              Reduce el estrés y mejora tu bienestar físico y mental.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-rose-400 mb-2">
              Tratamientos Faciales
            </h4>
            <p className="text-gray-600">
              Cuida tu piel con nuestros tratamientos personalizados.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-rose-400 mb-2">
              Manicure & Pedicure
            </h4>
            <p className="text-gray-600">
              Resalta tu estilo con un cuidado profesional de manos y pies.
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Productos */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold text-rose-500 text-center mb-8">
          Productos Destacados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-gray-800">
              Crema Hidratante
            </h4>
            <p className="text-gray-600">Nutrición intensa para tu piel.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-gray-800">
              Aceite Esencial
            </h4>
            <p className="text-gray-600">Relajación natural y aromaterapia.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <h4 className="text-lg font-semibold text-gray-800">
              Mascarilla Facial
            </h4>
            <p className="text-gray-600">Refresca y revitaliza tu piel.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-rose-200 mt-auto">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Shirly Rose · Estética & Spa
        </p>
      </footer>
    </div>
  );
}
