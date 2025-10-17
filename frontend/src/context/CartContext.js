import React, { createContext, useContext, useState, useEffect } from "react";

// Crea el contexto
const CartContext = createContext();

// Hook para usar el contexto fácilmente
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // Estado del carrito: array de { id, type, name, price, image, cantidad }
  const [cart, setCart] = useState([]);

  // --- Cargar carrito de localStorage al iniciar ---
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // --- Guardar carrito en localStorage cuando cambie ---
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // --- Agregar producto/servicio al carrito ---
  function addToCart(item) {
    // Si ya existe: suma cantidad, si no, agrega nuevo
    setCart(prev => {
      const found = prev.find(
        i => i.id === item.id && i.type === item.type
      );
      if (found) {
        return prev.map(i =>
          i.id === item.id && i.type === item.type
            ? { ...i, cantidad: i.cantidad + (item.cantidad || 1) }
            : i
        );
      }
      return [...prev, { ...item, cantidad: item.cantidad || 1 }];
    });
  }

  // --- Quitar del carrito ---
  function removeFromCart(id, type) {
    setCart(prev => prev.filter(i => !(i.id === id && i.type === type)));
  }

  // --- Limpiar carrito ---
  function clearCart() {
    setCart([]);
  }

  // --- Total ---
  const total = cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  // --- Valor del contexto ---
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}