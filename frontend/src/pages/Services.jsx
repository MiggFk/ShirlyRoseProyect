import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

// Imágenes
import pressOn from "../assets/images/services/pressOn.jpg";
import RecubrimientoPoli from "../assets/images/services/Recubrimiento-Poligel.jpg";
import Hidralips from "../assets/images/services/Hidralips.jpg";
import Acrilico from "../assets/images/services/Acrilico.jpg";
import Pestañas from "../assets/images/services/Pestañas.jpg";
import Acriesculpido from "../assets/images/services/Acrilico-esculpido.jpg";

// Array de servicios
const servicesData = [
  {
    title: "Acrilico Esculpido",
    description: "Descripcion",
    duration: "duracion",
    price: "$60.000",
    image: Acriesculpido,
  },
  {
    title: "Press On",
    description: "",
    duration: "30 min",
    price: "$40.000",
    image: pressOn,
  },
  {
    title: "Recubrimiento Poligel",
    description: "Cuidado para tus manos con un estilo clásico.",
    duration: "3 Horas",
    price: "$30.000",
    image: RecubrimientoPoli,
  },
  {
    title: "Hidralips",
    description:
      "Tratamiento para hidratar, rejuvenecer y mejorar la apariencia de los labios",
    duration: "45 min",
    price: "$75.000",
    image: Hidralips,
  },
  {
    title: "Uñas Acrilicas",
    description: "Uñas semi con el diseño que gustes.",
    duration: "40 min",
    price: "$45.000",
    image: Acrilico,
  },
  {
    title: "Pestañas Pelo a Pelo",
    description: "Descripcion",
    duration: "50 min",
    price: "$90.000",
    image: Pestañas,
  },
  {
    title: "-----",
    description: "descripcion",
    duration: "tiempo",
    price: "Precio",
    image: Acrilico,
  },
  {
    title: "-----",
    description: "descripcion",
    duration: "tiempo",
    price: "Precio",
    image: Acrilico,
  },
  {
    title: "-----",
    description: "descripcion",
    duration: "tiempo",
    price: "Precio",
    image: Acrilico,
  },
  {
    title: "-----",
    description: "descripcion",
    duration: "tiempo",
    price: "Precio",
    image: Acrilico,
  },
  {
    title: "-----",
    description: "descripcion",
    duration: "tiempo",
    price: "Precio",
    image: Acrilico,
  },
  {
    title: "-----",
    description: "descripcion",
    duration: "tiempo",
    price: "Precio",
    image: Acrilico,
  },
];

export default function Services() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-rose-100">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3">
        {/* Botón menú hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-rose-600 hover:text-rose-800 transition"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Título centrado */}
        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-3xl font-extrabold text-rose-500 italic"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Shirly Rose
        </h1>

        {/* Subtítulo */}
        <h1 className="ml-auto text-lg font-bold text-rose-600">Servicios</h1>
      </header>

      {/* Menú lateral */}
      <nav
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
          to="/products"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Productos
        </Link>
        <Link
          to="/about"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Nosotros
        </Link>
        <Link
          to="/contact"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Contacto
        </Link>
        <Link
          to=""
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          셜리 로즈
        </Link>
      </nav>

      {/* Fondo semi-transparente */}
      {menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/20 z-30"
          aria-hidden="true"
        />
      )}

      {/* Contenido */}
      <main className="pt-24 px-6 pb-12">
        <h2 className="text-3xl font-bold text-rose-600 text-center mb-10">
          Nuestros Servicios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-rose-500 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <p className="text-sm text-gray-500">
                  Duración: {service.duration}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Precio: {service.price}
                </p>
                <button className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 rounded-lg font-medium transition">
                  Reservar
                </button>
              </div>
            </div>
          ))}
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
