import { Link } from "react-router-dom";
import Logo from "../assets/logos/Logo-ShirlyRose.png";

// Importar imágenes de servicios
import Nails1 from "../assets/images/services/uñas-1.jpg";
import Nails2 from "../assets/images/services/uñas-2.jpg";
import Nails3 from "../assets/images/services/uñas-3.jpg";

// Importar imágenes de productos
import Aceites from "../assets/images/products/aceite.jpg";
import Cremas from "../assets/images/products/exfoliante.jpg";
import Shampoo from "../assets/images/products/shampoo.jpg";

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
            className="h-12 w-12 object-contain"
          />
          <h1 className="text-xl font-bold text-rose-500">SHIRLY ROSE</h1>
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
        <h2 className="text-4xl md:text-7xl font-extrabold text-rose-500 mb-4 italic" style={{ fontFamily: "'Great Vibes', cursive" }}>
          Shirly Rose
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
          Servicios Destacados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={Nails1} alt="Uñas 1" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-xl font-semibold text-rose-400">
                Diseño de Uñas
              </h4>
              <p className="text-gray-600">
                Manicure profesional con estilos únicos.
              </p>
              <Link
                to="/services"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={Nails2} alt="Uñas 2" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-xl font-semibold text-rose-400">
                Pedicure Spa
              </h4>
              <p className="text-gray-600">
                Relaja tus pies y luce impecable.
              </p>
              <Link
                to="/services"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={Nails3} alt="Uñas 3" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-xl font-semibold text-rose-400">
                Uñas Acrílicas
              </h4>
              <p className="text-gray-600">
                Estilos modernos y de larga duración.
              </p>
              <Link
                to="/services"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Productos */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold text-rose-500 text-center mb-8">
          Productos Destacados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={Cremas} alt="Cremas" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Exfoliante
              </h4>
              <p className="text-gray-600">Nutrición intensa para tu piel.</p>
              <Link
                to="/products"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={Aceites} alt="Aceites" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Aceites Naturales
              </h4>
              <p className="text-gray-600">Aromaterapia y cuidado natural.</p>
              <Link
                to="/products"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
            <img src={Shampoo} alt="Shampoo" className="h-40 w-full object-cover" />
            <div className="p-6 flex flex-col gap-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Shampoo Orgánico
              </h4>
              <p className="text-gray-600">Frescura y brillo para tu cabello.</p>
              <Link
                to="/products"
                className="text-sm text-rose-500 font-medium hover:underline self-start"
              >
                Ver más →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-rose-200 mt-auto">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} 셜리 로즈 · Estética & Spa
        </p>
      </footer>
    </div>
  );
}
