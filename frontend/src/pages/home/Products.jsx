import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import SideBarPublic from "../../components/SideBarPublic";


// Rutas de las imagenes
import shampoo from "../../assets/images/products/shampoo.jpg";
import exfoliante from "../../assets/images/products/exfoliante.jpg";
import aceite from "../../assets/images/products/aceite.jpg";
import Balsamo from "../../assets/images/products/Balsamo.jpg";
import SinNada from "../../assets/images/SinFoto.jpg";



export default function Products() {

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

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(234, 128, 150, 0.4)" },
  };

  return (
    <motion.div
      className="min-h-screen bg-rose-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >

      {/* SideBar */}
      <SideBarPublic title="Shirly Rose" />

      <main className="flex-grow pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-rose-600 text-center mb-10">
          Nuestros Productos
        </h2>

        {/* Grid animado */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {productos.map((prod) => (
            <motion.div
              key={prod.id}
              className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden"
              variants={cardVariants}
              whileHover="hover"
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
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto bg-rose-400 hover:bg-rose-500 text-white py-2 px-6 rounded-lg font-medium transition"
                  >
                    Encargar
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto border border-rose-300 text-rose-600 py-2 px-6 rounded-lg transition hover:bg-rose-100"
                  >
                    Añadir al carrito
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="text-center py-6 bg-rose-200"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
      >
        <Footer />
      </motion.footer>
    </motion.div>
  );
}
