import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart as CartIcon, X } from "lucide-react";
import { useCart } from '../context/CartContext';

export default function ShoppingCart({ className = "" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cart, removeFromCart, clearCart, total } = useCart();

  return (
    <>
      {/* Botón Carrito */}
      <button
        onClick={() => setIsCartOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition ${className}`}
        aria-label="Abrir carrito"
      >
        <CartIcon size={20} />
      </button>

      {/* Modal del Carrito */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />

            {/* Panel del carrito */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed right-0 top-0 z-50 bg-white w-full sm:w-[400px] h-full shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                {/* Header del carrito */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    CARRITO DE COMPRA
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-gray-800 transition p-2 hover:bg-gray-100 rounded-full"
                    aria-label="Cerrar carrito"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Contenido del carrito */}
                <div className="space-y-4">
                  {/* Estado vacío */}
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                      <CartIcon size={48} className="text-rose-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">
                      Su carrito actualmente está vacío
                    </p>
                    <p className="text-gray-400 text-sm">
                      ¡Agrega productos para comenzar!
                    </p>
                  </div>

                  {/* Aquí irían los productos del carrito cuando los haya */}
                  {/* Ejemplo de estructura:
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <img src={item.image} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  */}
                </div>

                {/* Footer del carrito */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full bg-rose-400 hover:bg-rose-500 text-white font-semibold py-3 rounded-lg transition shadow-lg"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}