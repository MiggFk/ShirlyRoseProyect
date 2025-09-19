import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

// Rutas de las imagenes
import shampoo from "../assets/images/products/shampoo.jpg";
import exfoliante from "../assets/images/products/exfoliante.jpg";
import aceite from "../assets/images/products/aceite.jpg";
import Balsamo from "../assets/images/products/Balsamo.jpg";
import SinNada from "../assets/images/SinFoto.jpg";


export default function Products() {
  const [menuOpen, setMenuOpen] = useState(false);

// Productos

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
    {
      id:5,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
        {
      id:6,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
        {
      id:7,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
    {
      id:8,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
        {
      id:9,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
        {
      id:10,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
        {
      id:11,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img: SinNada,
    },
        {
      id:12,
      nombre: "Nombre producto",
      descripcion: "Descripcion",
      precio: "Precio",
      duracion: "ml del producto",
      img:SinNada,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-rose-100">
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

        {/* Título centrado */}
        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-3xl font-extrabold text-rose-500 italic"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Shirly Rose
        </h1>
      </header>

      {/* Menú lateral debajo del header */}
      <nav
         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6 transform transition-transform duration-300 ${
    menuOpen ? "translate-x-0" : "-translate-x-full"
  }`}
        aria-hidden={!menuOpen}
      >
        <Link to="" className="text-rose-600 font-medium hover:text-rose-800 "onClick={() => setMenuOpen(false)}>----</Link>
        <Link to="/"className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link to="/services"className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>Servicios</Link>
        <Link to="/about"className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>Nosotros</Link>
        <Link to="/contact"className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>Contacto</Link>
        <Link to="/Cita"className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>Agenda Cita</Link> 
        <Link to=""className="text-rose-600 font-medium hover:text-rose-800"onClick={() => setMenuOpen(false)}>셜리 로즈</Link> 
      </nav>

      {/* Fondo semi-transparente ajustado para no tapar el header */}
      {menuOpen && (
        <button
  onClick={() => setMenuOpen(false)}
  className="fixed top-0 left-0 w-full h-full bg-black/20 z-30"
  aria-hidden="true"
/>
      )}

      {/* Contenido con espacio para el header fijo */}
      <main className="flex-grow pt-24 pb-12 px-6 max-w-6xl mx-auto">
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
              {/* Imagen */}
              <img
                src={prod.img}
                alt={prod.nombre}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
              />

              {/* Texto */}
              <div className="p-6 flex flex-col justify-center md:w-2/3">
                <h3 className="text-xl font-bold text-rose-500 mb-2">
                  {prod.nombre}
                </h3>
                <p className="text-gray-600 mb-2">{prod.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Contenido: {prod.duracion}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Precio: {prod.precio}
                </p>
                <div className="flex gap-3">
                  <button className="w-full md:w-auto bg-rose-400 hover:bg-rose-500 text-white py-2 px-6 rounded-lg font-medium transition">
                    Encargar
                  </button>
                  <button className="w-full md:w-auto border border-rose-300 text-rose-600 py-2 px-6 rounded-lg transition hover:bg-rose-100">
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
