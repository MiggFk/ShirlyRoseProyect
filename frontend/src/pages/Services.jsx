import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import uñas4 from "../assets/images/services/uñas-4.jpg";
import uñas5 from "../assets/images/services/uñas-5.jpg";
import uñas6 from "../assets/images/services/uñas-6.jpg";
import labios from "../assets/images/services/labios.jpg";
import uñas7 from "../assets/images/services/uñas-7.jpg";
import Pestañas from "../assets/images/services/Pestañas.jpg";

export default function Services() {
  return (
    <div className="min-h-screen bg-rose-100">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-6 py-3">
        {/* Icono Home */}
        <Link
          to="/"
          title="Volver al inicio"
          className="text-rose-600 hover:text-rose-800 transition"
        >
          <FiHome size={28} />
        </Link>

        {/* Navegación */}
        <nav className="flex gap-6">
          <a href="#cejas" className="text-gray-700 hover:text-rose-500 font-medium">
            Cejas
          </a>
          <a href="#uñas" className="text-gray-700 hover:text-rose-500 font-medium">
            Uñas
          </a>
        </nav>
      </header>

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
              <h3 className="text-xl font-bold text-rose-500 mb-2">Uñas Acrilicas</h3>
              <p className="text-gray-600 mb-2">Diseño minimalista a tu eleccion.</p>
              <p className="text-sm text-gray-500">Duración: 40 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $60.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 2 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" id="uñas">
            <img src={uñas5} alt="Servicio 2" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Manicure & Pedicure</h3>
              <p className="text-gray-600 mb-2">Cuidado profesional para manos y pies con un diseño original.</p>
              <p className="text-sm text-gray-500">Duración: 30 min</p>
              <p className="text-sm text-gray-500 mb-4">Precio: $40.000</p>
              <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                Reservar
              </button>
            </div>
          </div>

          {/* Carta 3 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" id="cejas">
            <img src={uñas6} alt="Servicio 3" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-rose-500 mb-2">Manicure & Pedicure</h3>
              <p className="text-gray-600 mb-2">Cuidado para tus manos con un estilo clasico</p>
              <p className="text-sm text-gray-500">Duración: 25 min</p>
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
              <h3 className="text-xl font-bold text-rose-500 mb-2">Tratamiento de labios</h3>
              <p className="text-gray-600 mb-2">Libérate del estrés con masajes exclusivos.</p>
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
              <h3 className="text-xl font-bold text-rose-500 mb-2">Uñas Semipermanente</h3>
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
              <h3 className="text-xl font-bold text-rose-500 mb-2">Cejas Pelo a Pelo</h3>
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


        </div>
      </main>
    </div>
  );
}
