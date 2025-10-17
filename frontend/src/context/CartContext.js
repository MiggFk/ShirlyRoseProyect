import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const LOCAL_KEY = "cart";

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("Error parsing cart from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Error saving cart to localStorage", e);
    }
  }, [cart]);

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id && i.type === item.type);
      if (found) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, cantidad: (i.cantidad || 1) + (item.cantidad || 1) }
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
          ? { ...item, cantidad: (item.cantidad || 1) + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id, type) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.type === type
            ? { ...item, cantidad: (item.cantidad || 1) - 1 }
            : item
        )
        .filter((item) => (item.cantidad || 0) > 0)
    );
  }

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price || 0) * (item.cantidad || 1), 0);
  }, [cart]);

  const totalCantidad = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    total,
    totalCantidad,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}