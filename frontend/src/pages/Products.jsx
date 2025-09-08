import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

// Ajusta rutas si tus imágenes están en otra carpeta
import shampoo from "../assets/images/products/shampoo.jpg";
import exfoliante from "../assets/images/products/exfoliante.jpg";
import aceite from "../assets/images/products/aceite.jpg";
import Balsamo from "../assets/images/products/Balsamo.jpg";

export default function Products() {
  const [menuOpen, setMenuOpen] = useState(false);

  const productos = [
    {
      id: 1,
      nombre: "Shampoo Nutritivo",
      descripcion: "Limpieza suave y nutrición profunda para tu cabello.",
      precio: "$60.000",
      duracion: "500 ml",
      img: shampoo,
    },
    {
      id: 2,
      nombre: "Acondicionador Hidratante",
      descripcion: "Hidratación intensa y brillo natural.",
      precio: "$50.000",
      duracion: "500 ml",
      img: exfoliante,
    },
    {
      id: 3,
      nombre: "Aceite Esencial",
      descripcion: "Aromaterapia y nutrición para piel y cabello.",
      precio: "$35.000",
      duracion: "120 ml",
      img: aceite,
    },
    {
      id: 4,
      nombre: "Balsamo",
      descripcion: "Balsamo alisador de contorno de ojos.",
      precio: "$40.000",
      duracion: "500 ml",
      img: Balsamo,
    },
    // puedes añadir más objetos aquí
  ];

  return (
    <div className="min-h-screen flex flex-col bg-rose-100">
      {/* Header fijo (idéntico al de Services.jsx) */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3 relative">
        {/* Botón menú hamburguesa (izquierda) */}
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

      {/* Menú lateral (deslizable desde la izquierda) */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <Link
          to="/"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Inicio
        </Link>

        <Link
          to="/services"
          className="text-rose-600 font-medium hover:text-rose-800"
          onClick={() => setMenuOpen(false)}
        >
          Servicios
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
      </nav>

      {/* Fondo semi-transparente al abrir menú (para cerrar clickeando fuera) */}
      {menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/20 z-30"
          aria-hidden="true"
        />
      )}

      {/* Contenido */}
      <main className="flex-grow pt-20 pb-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-rose-600 text-center mb-10">
          Nuestros Productos
        </h2>

        {/* Grid: 2 por fila en pantallas md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden"
            >
              {/* Imagen (lado izquierdo en desktop) */}
              <img
                src={prod.img}
                alt={prod.nombre}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
              />

              {/* Texto (lado derecho en desktop) */}
              <div className="p-6 flex flex-col justify-center md:w-2/3">
                <h3 className="text-xl font-bold text-rose-500 mb-2">
                  {prod.nombre}
                </h3>
                <p className="text-gray-600 mb-2">{prod.descripcion}</p>
                <p className="text-sm text-gray-500">Contenido: {prod.duracion}</p>
                <p className="text-sm text-gray-500 mb-4">Precio: {prod.precio}</p>
                <div className="flex gap-3">
                  <button className="w-full md:w-auto bg-rose-400 hover:bg-rose-500 text-white py-2 px-6 rounded-lg font-medium transition">
                    Comprar
                  </button>
                  <button className="w-full md:w-auto border border-rose-300 text-rose-600 py-2 px-6 rounded-lg transition hover:bg-rose-50">
                    Añadir al carrito
                  </button>
                </div>
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
