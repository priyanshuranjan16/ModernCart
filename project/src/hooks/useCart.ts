import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { CartItem } from '../types';
import { useAuth } from './useAuth';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCartItems = useCallback(async () => {
    if (!user) {
      const localCart = localStorage.getItem('guest_cart');
      setCartItems(localCart ? JSON.parse(localCart) : []);
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      // Normalize backend response to match CartItem type
      const normalizedItems = data.items.map((item: any) => ({
        id: item._id,
        product_id: item.product._id,
        quantity: item.quantity,
        product: {
          id: item.product._id,
          ...item.product
        }
      }));
      setCartItems(normalizedItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      // Handle guest cart in local storage
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existing = localCart.find((item: any) => item.product_id === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        // We'd need to fetch product info for guest cart to be useful, 
        // or just store IDs and fetch details when viewing cart.
        // For now, simpler to just store IDs.
        localCart.push({ product_id: productId, quantity });
      }
      localStorage.setItem('guest_cart', JSON.stringify(localCart));
      fetchCartItems();
      return { success: true };
    }

    try {
      await api.post('/cart/add', { productId, quantity });
      await fetchCartItems();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const itemIndex = localCart.findIndex((item: any) => item.product_id === productId);
      if (itemIndex > -1) {
        if (quantity <= 0) {
          localCart.splice(itemIndex, 1);
        } else {
          localCart[itemIndex].quantity = quantity;
        }
        localStorage.setItem('guest_cart', JSON.stringify(localCart));
        fetchCartItems();
      }
      return;
    }

    try {
      await api.put('/cart/update', { productId, quantity });
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const filtered = localCart.filter((item: any) => item.product_id !== productId);
      localStorage.setItem('guest_cart', JSON.stringify(filtered));
      fetchCartItems();
      return;
    }

    try {
      await api.delete(`/cart/${productId}`);
      await fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem('guest_cart');
      setCartItems([]);
      return;
    }
    // Backend clear needed, or just delete items
    // ...
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.sale_price || item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCartItems
  };
}