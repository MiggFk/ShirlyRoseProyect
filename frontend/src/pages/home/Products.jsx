import React, { useState } from 'react';
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import PublicNavbar from "../../components/PublicNavbar";
import { usePublicProducts } from '../../hooks/usePublicProducts'; 
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function Products() {
  const { products, loading, error } = usePublicProducts();
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();

  // Filtrar productos por búsqueda
  const filteredProducts = React.useMemo(() => {
    if (!search.trim()) return products;
    
    const searchLower = search.toLowerCase().trim();
    
    return products.filter(product => {
      const productName = (product.name || '').toLowerCase();
      const productDesc = (product.description || '').toLowerCase();
      return productName.includes(searchLower) || productDesc.includes(searchLower);
    });
  }, [products, search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-rose-600 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rose-100 flex items-center justify-center">
        <div className="text-red-500 text-center max-w-md mx-auto p-8">
          <ShoppingBag size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-4">Error al cargar productos</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Variantes de animación
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(234, 128, 150, 0.4)" },
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <PublicNavbar />
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-rose-500 text-3xl">🛍️</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
              Nuestros Productos
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explora nuestra selección de productos de belleza y bienestar
          </p>
        </motion.div>

        {/* Barra de búsqueda */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 transition text-sm"
            />
          </div>
        </motion.div>

        {/* Grid de productos */}
        {products.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">Próximamente</p>
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500">Intenta con otra búsqueda</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition text-sm"
            >
              Limpiar
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                index={index}
                addToCart={addToCart}
                cardVariants={cardVariants}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function ProductCard({ product, index, addToCart, cardVariants }) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full cursor-pointer"
    >
      {/* Imagen - más compacta */}
      <div className="relative w-full h-40 bg-gradient-to-br from-rose-100 to-pink-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-rose-300" />
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Título */}
        <h3 className="font-bold text-base text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Descripción */}
        {product.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Precio y Botón */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-rose-500">
            ${product.price?.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart({
              id: product._id,
              type: 'producto',
              name: product.name,
              price: product.price,
              image: product.images?.[0]?.url,
              cantidad: 1,
            })}
            className="bg-rose-400 hover:bg-rose-500 text-white font-medium px-4 py-2 rounded-lg transition text-sm"
          >
            Comprar
          </motion.button>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
            <span className="text-white font-semibold">Agotado</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}