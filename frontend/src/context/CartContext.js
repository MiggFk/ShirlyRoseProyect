import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id && i.type === item.type);
      if (found) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, cantidad: i.cantidad + (item.cantidad || 1) }
            : i
        );
      }
      return [...prev, { ...item, cantidad: item.cantidad || 1 }];
    });
  }

  function removeFromCart(id, type) {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  }

  function clearCart() {
    setCart([]);
  }

  function increaseQuantity(id, type) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.type === type
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id, type) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.type === type
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.cantidad, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}