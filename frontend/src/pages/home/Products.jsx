import React from 'react';
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import SideBarPublic from "../../components/SideBarPublic";
import { usePublicProducts } from '../../hooks/usePublicProducts'; // Hook público

export default function Products() {
  const { products, loading, error } = usePublicProducts(); // Sin autenticación

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rose-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-500">No hay productos disponibles</h3>
            </div>
          ) : (
            products.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden"
                variants={cardVariants}
                whileHover="hover"
              >
                {/* Imagen */}
                <img
                  src={product.images && product.images.length > 0 ? product.images[0].url : '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                />

                {/* Texto */}
                <div className="p-6 flex flex-col justify-center md:w-2/3">
                  <h3 className="text-xl font-bold text-rose-500 mb-2">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-gray-600 mb-2">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Contenido: {product.duracion}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Precio: ${product.price?.toLocaleString()}
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

                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Agotado</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
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
