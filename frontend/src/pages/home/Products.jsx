import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import Footer from "../../components/Footer";

export default function ProductsHome() {
  const { products, loading } = useProducts();
  const [menuOpen, setMenuOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-rose-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
    >
      {/* Header fijo */}
      <motion.header
        className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center px-6 py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-rose-600 hover:text-rose-800 transition z-20"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
              >
                <FiX size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu-icon"
                initial={{ rotate: 180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 180, scale: 0 }}
              >
                <FiMenu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-4xl md:text-3xl font-extrabold text-rose-500 italic"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Shirly Rose
        </h1>
      </motion.header>

      {/* Menú lateral */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 flex flex-col gap-6"
          >
            <Link to="/" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/products" className="text-rose-600 hover:text-rose-800 font-bold" onClick={() => setMenuOpen(false)}>Productos</Link>
            <Link to="/services" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Servicios</Link>
            <Link to="/about" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Nosotros</Link>
            <Link to="/appointment" className="text-rose-600 hover:text-rose-800" onClick={() => setMenuOpen(false)}>Agendar Cita</Link>
          </motion.nav>
        )}

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Contenido */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="pt-24 px-6 pb-12"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
          className="text-5xl font-bold text-rose-500 text-center mb-12"
        >
          Nuestros Productos
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-rose-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    {product.category && (
                      <span className="inline-block mt-3 px-3 py-1 bg-rose-100 text-rose-600 text-xs rounded-full">
                        {product.category}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">No hay productos disponibles en este momento</p>
              </div>
            )}
          </div>
        )}
      </motion.main>

      {/* Footer */}
      <motion.footer
        className="text-center py-6 bg-rose-200 mt-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.8 } }}
      >
        <Footer />
      </motion.footer>
    </motion.div>
  );
}