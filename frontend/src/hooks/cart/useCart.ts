import { useState, useEffect } from 'react';
import { Cart, CartItem } from '../../types/cart';

const CART_STORAGE_KEY = 'cart';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (i) => 
          i.product.id === item.product.id && 
          i.variant.id === item.variant.id && 
          i.size === item.size
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += item.quantity;
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }

      return {
        items: [...prevCart.items, item],
        total: calculateTotal([...prevCart.items, item]),
      };
    });
  };

  const removeFromCart = (item: CartItem) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (i) => 
          i.product.id !== item.product.id || 
          i.variant.id !== item.variant.id || 
          i.size !== item.size
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const updateQuantity = (item: CartItem, quantity: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.map((i) => {
        if (
          i.product.id === item.product.id && 
          i.variant.id === item.variant.id && 
          i.size === item.size
        ) {
          return { ...i, quantity };
        }
        return i;
      });
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const price = item.variant.sale_price || item.variant.price;
      return total + price * item.quantity;
    }, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}; 