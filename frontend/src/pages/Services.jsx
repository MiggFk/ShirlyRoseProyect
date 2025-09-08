import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // iconos menú y cerrar
import uñas4 from "../assets/images/services/uñas-4.jpg";
import uñas5 from "../assets/images/services/uñas-5.jpg";
import uñas6 from "../assets/images/services/uñas-6.jpg";
import labios from "../assets/images/services/labios.jpg";
import uñas7 from "../assets/images/services/uñas-7.jpg";
import Pestañas from "../assets/images/services/Pestañas.jpg";

export default function Services() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-rose-100">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-6 py-3">
        {/* Botón menú hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-rose-600 hover:text-rose-800 transition"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
        <h1 className="text-4xl md:text-3xl font-extrabold text-rose-500 italic" style={{ fontFamily: "'Great Vibes', cursive" }}>Shirly Rose</h1>
        <h1 className="text-lg font-bold text-rose-600">Servicios</h1>
      </header>

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          to=""
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          ----
        </Link>
        <Link
          to="/"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Inicio
        </Link>
        <Link
          to="/Products"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Productos
        </Link>
        <Link
          to="/About"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Nosotros
        </Link>

        <Link
          to="/"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          셜리 로즈
          </Link>  
      </div>

      {/* Contenido */}
      <main className="pt-20 px-6 pb-12">
        <h2 className="text-3xl font-bold text-rose-600 text-center mb-10">
          Nuestros Servicios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Carta 1 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas4} alt="Servicio 1" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Press On</h3>
              <p className="text-gray-600 mb-2">Diseño minimalista a tu elección.</p>
              <p className="text-sm text-gray-500">Duración: 40 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $60.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas5} alt="Servicio 2" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Press On</h3>
              <p className="text-gray-600 mb-2">
                Cuidado profesional para manos y pies con un diseño original.
              </p>
              <p className="text-sm text-gray-500">Duración: 30 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $40.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas6} alt="Servicio 3" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Recubrimiento Poligel</h3>
              <p className="text-gray-600 mb-2">Cuidado para tus manos con un estilo clásico.</p>
              <p className="text-sm text-gray-500">Duración: 3 Horas</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $30.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 4 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={labios} alt="Servicio 4" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Hidralips</h3>
              <p className="text-gray-600 mb-2">tratamiento para hidratar, rejuvenecer y mejorar la apariencia de los labios</p>
              <p className="text-sm text-gray-500">Duración: 45 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $75.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 5 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 5" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Uñas Acrilicas</h3>
              <p className="text-gray-600 mb-2">Uñas semi con el diseño que gustes.</p>
              <p className="text-sm text-gray-500">Duración: 40 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $45.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 6 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={Pestañas} alt="Servicio 6" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Pestañas Pelo a Pelo</h3>
              <p className="text-gray-600 mb-2">Resalta tu mirada con un diseño perfecto.</p>
              <p className="text-sm text-gray-500">Duración: 50 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $90.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 7 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 7" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">-----</h3>
              <p className="text-gray-600 mb-2">descripcion</p>
              <p className="text-sm text-gray-500">tiempo</p>
              <p className="text-sm text-gray-500 mb-4">Precio</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 8 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 8" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">-----</h3>
              <p className="text-gray-600 mb-2">descripcion</p>
              <p className="text-sm text-gray-500">tiempo</p>
              <p className="text-sm text-gray-500 mb-4">Precio</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 9 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 9" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">-----</h3>
              <p className="text-gray-600 mb-2">descripcion</p>
              <p className="text-sm text-gray-500">tiempo</p>
              <p className="text-sm text-gray-500 mb-4">Precio</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 10 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 7" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">-----</h3>
              <p className="text-gray-600 mb-2">descripcion</p>
              <p className="text-sm text-gray-500">tiempo</p>
              <p className="text-sm text-gray-500 mb-4">Precio</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 11 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 8" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">-----</h3>
              <p className="text-gray-600 mb-2">descripcion</p>
              <p className="text-sm text-gray-500">tiempo</p>
              <p className="text-sm text-gray-500 mb-4">Precio</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 12 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={uñas7} alt="Servicio 9" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">-----</h3>
              <p className="text-gray-600 mb-2">descripcion</p>
              <p className="text-sm text-gray-500">tiempo</p>
              <p className="text-sm text-gray-500 mb-4">Precio</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-rose-200">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Shirly Rose · Estética & Spa
        </p>
      </footer>
    </div>
  );
}
