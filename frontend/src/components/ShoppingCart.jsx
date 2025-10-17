import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart as CartIcon, X, Trash2, CheckCircle2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

export default function ShoppingCart({ className = "" }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, removeFromCart, clearCart, total, increaseQuantity, decreaseQuantity } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Animación del badge
  const [badgeBump, setBadgeBump] = useState(false);
  const prevCartCount = useRef(cart.reduce((a, b) => a + b.cantidad, 0));

  // Detecta cualquier cambio en cantidad total de items (no solo cantidad de entradas)
  const totalCount = cart.reduce((a, b) => a + b.cantidad, 0);

  // Animaciones para badge y toast
  if (totalCount > prevCartCount.current) {
    setBadgeBump(true);
    const last = cart[cart.length - 1];
    setAddedId(last ? last.id + last.type : null);
    setShowToast(true);
    setTimeout(() => setBadgeBump(false), 350);
    setTimeout(() => setAddedId(null), 1000);
    setTimeout(() => setShowToast(false), 1400);
    prevCartCount.current = totalCount;
  } else if (totalCount < prevCartCount.current) {
    prevCartCount.current = totalCount;
  }

  const hasItems = cart && cart.length > 0;

  // Confirmación visual al vaciar carrito
  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "¿Vaciar carrito?",
      text: "¿Estás seguro de que quieres eliminar todos los productos del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
      backdrop: true,
    });

    if (result.isConfirmed) {
      clearCart();
      Swal.fire({
        icon: "success",
        title: "Carrito vaciado",
        showConfirmButton: false,
        timer: 900,
      });
    }
  };

  return (
    <>
      {/* Toast flotante superior right */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="fixed z-[9999] top-6 right-6 bg-white rounded-xl shadow-2xl px-6 py-3 flex items-center gap-3 border border-green-200"
            style={{ pointerEvents: "none" }}
          >
            <CheckCircle2 className="text-green-500" size={28} />
            <div>
              <span className="text-green-700 font-bold block">¡Agregado!</span>
              <span className="text-gray-500 text-xs">Producto o servicio añadido al carrito</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Carrito */}
      <motion.button
        onClick={() => setIsCartOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-400 text-white font-medium shadow hover:bg-rose-500 transition relative ${className}`}
        aria-label="Abrir carrito"
        animate={badgeBump ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <CartIcon size={20} />
        <AnimatePresence>
          {hasItems && (
            <motion.span
              key="badge"
              initial={{ scale: 0, y: -8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -8 }}
              className="ml-1 inline-flex items-center justify-center w-5 h-5 bg-white text-rose-500 rounded-full text-xs font-bold border-2 border-rose-400"
            >
              {totalCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

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
              className="fixed right-0 top-0 z-50 bg-white w-full sm:w-[420px] h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 pb-2 flex-shrink-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
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
              </div>

              {/* Contenido scrollable */}
              <div className="flex-1 overflow-y-auto px-6 pb-2 pt-2 custom-scrollbar">
                <AnimatePresence>
                  {hasItems ? (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <motion.div
                          key={item.id + item.type}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            boxShadow:
                              addedId === item.id + item.type
                                ? "0 0 0 4px #4ade80, 0 4px 20px rgba(234,128,150,0.1)"
                                : "0 1px 8px 0 rgba(0,0,0,0.06)",
                            background:
                              addedId === item.id + item.type
                                ? "#e6fbe8"
                                : "#fff"
                          }}
                          exit={{ opacity: 0, x: 50 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4 p-4 border rounded-lg items-center relative"
                        >
                          <img
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded bg-rose-50 border"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                            <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                            <p className="text-sm text-rose-500 font-bold">${item.price?.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                className="bg-gray-100 hover:bg-rose-100 text-rose-500 rounded-full w-7 h-7 flex items-center justify-center border"
                                aria-label="Restar uno"
                                onClick={() => decreaseQuantity(item.id, item.type)}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="font-semibold text-gray-700">{item.cantidad}</span>
                              <button
                                className="bg-gray-100 hover:bg-rose-100 text-rose-500 rounded-full w-7 h-7 flex items-center justify-center border"
                                aria-label="Sumar uno"
                                onClick={() => increaseQuantity(item.id, item.type)}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                          <motion.button
                            className="text-gray-400 hover:text-rose-500 p-1"
                            aria-label="Eliminar"
                            whileTap={{ scale: 0.8, rotate: -20 }}
                            onClick={() => removeFromCart(item.id, item.type)}
                          >
                            <Trash2 size={20} />
                          </motion.button>
                          {addedId === item.id + item.type && (
                            <motion.span
                              className="absolute top-2 right-1 text-green-600"
                              initial={{ scale: 0.7, opacity: 0 }}
                              animate={{ scale: 1.2, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle2 size={22} />
                            </motion.span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // Estado vacío
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                        <CartIcon size={48} className="text-rose-400" />
                      </div>
                      <p className="text-gray-600 text-lg mb-2">
                        Su carrito actualmente está vacío
                      </p>
                      <p className="text-gray-400 text-sm">
                        ¡Agrega productos o servicios para comenzar!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 bg-white border-t flex flex-col gap-2 flex-shrink-0">
                {hasItems && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-700">Total</span>
                    <span className="text-2xl font-bold text-rose-500">${total?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  {hasItems && (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleClearCart}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-3 rounded-lg transition text-sm"
                    >
                      Vaciar Carrito
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsCartOpen(false)}
                    className={`flex-1 ${
                      hasItems
                        ? "bg-rose-400 hover:bg-rose-500 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    } font-semibold py-3 rounded-lg transition shadow-lg`}
                    disabled={!hasItems}
                  >
                    {hasItems ? "Ir al Checkout" : "Continuar Comprando"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Scrollbar custom solo en este componente */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: #f3f4f6;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fca5a5;
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}