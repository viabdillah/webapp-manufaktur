/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setCartItems(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data keranjang:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true); // <-- Tambahkan ini
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      if (response.ok) {
        await fetchCart(); // Tunggu fetchCart selesai
      }
    } catch (error) {
      console.error("Gagal menambah ke keranjang:", error);
    } finally {
      setLoading(false); // <-- Tambahkan ini
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true); // <-- Tambahkan ini
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchCart(); // Tunggu fetchCart selesai
      }
    } catch (error) {
      console.error("Gagal menghapus dari keranjang:", error);
    } finally {
      setLoading(false); // <-- Tambahkan ini
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, fetchCart]);

  // Kita tambahkan juga fungsi removeFromCart ke value
  const value = { cartItems, addToCart, removeFromCart, fetchCart, loading };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};