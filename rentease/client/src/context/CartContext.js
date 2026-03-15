import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); setCartCount(0); return; }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
      setCartCount(data.length);
    } catch { setCart([]); setCartCount(0); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, tenure) => {
    await api.post('/cart/add', { productId, tenure });
    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    await api.delete(`/cart/remove/${itemId}`);
    await fetchCart();
  };

  const updateCartItem = async (itemId, data) => {
    await api.put(`/cart/update/${itemId}`, data);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart([]); setCartCount(0);
  };

  const getTotal = () => cart.reduce((sum, item) => {
    if (!item.product) return sum;
    const key = `price${item.tenure}`;
    return sum + (item.product[key] || 0) * item.tenure;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, updateCartItem, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
