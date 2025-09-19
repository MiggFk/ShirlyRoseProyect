import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiSearch } from "react-icons/fi"; // 👈 añadí la lupa

// Imágenes (asegúrate que las rutas coincidan con tu /src/assets)
import pressOn from "../assets/images/services/Uñas/pressOn.jpg";
import RecubrimientoPoli from "../assets/images/services/Uñas/Recubrimiento-Poligel.jpg";
import Hidralips from "../assets/images/services/EsteticaFacial/Hidralips.jpg";
import Acrilico from "../assets/images/services/Uñas/Acrilico.jpg";
import Pestañas from "../assets/images/services/CejasyPestañas/Pestañas.jpg";
import Acriesculpido from "../assets/images/services/Uñas/Acrilico-esculpido.jpg";
import PeloaPeloHibridas from "../assets/images/services/CejasyPestañas/pelo-hibridas.jpg";
import Voltecnologico from "../assets/images/services/CejasyPestañas/volumen-Tecnologico.jpg"
import SinNada from "../assets/images/SinFoto.jpg";

// Mantengo exactamente tus servicios por categoría tal como los mandaste
const servicesByCategory = {
  "Uñas": [
    {
      title: "Acrilico Esculpido",
      description: "Descripcion",
      duration: "3 horas",
      price: "$60.000",
      image: Acriesculpido,
    },
    {
      title: "Press On",
      description:
        "uñas postizas pre-diseñadas que se adhieren a la uña natural de forma temporal, sin necesidad de luz UV/LED.",
      duration: "30 min",
      price: "$40.000",
      image: pressOn,
    },
    {
      title: "Recubrimiento Poligel",
      description: "Cuidado para tus manos con un estilo clásico.",
      duration: "2 Horas",
      price: "$30.000",
      image: RecubrimientoPoli,
    },
    {
      title: "Uñas Acrilicas",
      description: "Uñas semi con el diseño que gustes.",
      duration: "40 min",
      price: "$45.000",
      image: Acrilico,
    },
    {
      title: "Titulo",
      description: "descripcion",
      duration: "duracion",
      price: "precio",
      image: SinNada,
    },
    {
      title: "Titulo",
      description: "descripcion",
      duration: "duracion",
      price: "precio",
      image: SinNada,
    },
  ],
  "Estetica Facial": [
    {
      title: "Hidralips",
      description:
        "Tratamiento para hidratar, rejuvenecer y mejorar la apariencia de los labios",
      duration: "45 min",
      price: "$75.000",
      image: Hidralips,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
  ],
  "Pestañas y Cejas": [
    {
      title: "Pestañas pelo a pelo",
      description: "Descripcion",
      duration: "50 min",
      price: "$90.000",
      image: Pestañas,
    },
    {
      title: "Pestañas pelo a pelo hibridas",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: PeloaPeloHibridas,
    },
    {
      title: "Pestañas pelo a pelo volumen tecnológico",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: Voltecnologico,
    }
  ],
  "Peluqueria": [
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada, 
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada, 
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    }
  ],
  "Depilacion":[
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    },
    {
      title: "-----",
      description: "descripcion",
      duration: "tiempo",
      price: "Precio",
      image: SinNada,
    }
  ]
};

export default function Services() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filtra categorías por el texto escrito (si search está vacío devuelve todas)
  const filteredCategories = Object.entries(servicesByCategory).filter(
    ([category]) => category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-rose-100">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3">
        {/* Botón menú hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-rose-600 hover:text-rose-800 transition"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Título centrado (Great Vibes) */}
        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-3xl font-extrabold text-rose-500 italic"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Shirly Rose
        </h1>
      </header>

      {/* Menú lateral */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>----</Link>
        <Link to="/" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/products" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Productos</Link>
        <Link to="/about" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Nosotros</Link>
        <Link to="/contact" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>Contacto</Link>
        <Link to="/Cita"className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>Agenda Cita</Link>
        <Link to="/services" className="text-rose-600 font-medium hover:text-rose-800" onClick={() => setMenuOpen(false)}>셜리 로즈</Link>
      </nav>

      {/* Overlay semi-transparente */}
      {menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/20 z-30"
          aria-hidden="true"
        />
      )}

      {/* Contenido principal (dejo espacio para el header fijo) */}
      <main className="pt-28 px-6 pb-12">
        <h2 className="text-3xl font-bold text-rose-600 text-center mb-6">Nuestros Servicios</h2>

        {/* Barra de búsqueda con ícono 🔍 */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center w-full max-w-md bg-white border border-rose-300 rounded-full shadow-sm px-4 py-2">
            <input
              type="text"
              placeholder="Buscar por categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow outline-none bg-transparent text-gray-700 px-2"
            />
            <FiSearch className="text-gray-500 text-xl" />
          </div>
        </div>

        {/* Renderizo cada categoría dentro de un contenedor rosado y redondeado */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map(([category, services]) => (
            <section key={category} className="mb-16">
              {/* Contenedor rosado con título centrado (Great Vibes) */}
              <div className="bg-rose-200 rounded-[40px] p-8 shadow-md">
                <h3
                  className="text-4xl text-center mb-8 text-rose-600 italic"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {category}
                </h3>

                {/* Grid de cartas dentro del contenedor */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((service, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <img src={service.image} alt={service.title} className="h-48 w-full object-cover" />
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-rose-500 mb-2">{service.title}</h4>
                        <p className="text-gray-600 mb-2">{service.description}</p>
                        <p className="text-sm text-gray-500">Duración: {service.duration}</p>
                        <p className="text-sm text-gray-500 mb-4">Precio: {service.price}</p>
                        <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">Reservar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))
        ) : (
          <p className="text-center text-gray-600">No se encontraron categorías.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 bg-rose-200">
        <p className="text-sm text-gray-700">© {new Date().getFullYear()} Shirly Rose · Estética & Spa</p>
      </footer>
    </div>
  );
}
