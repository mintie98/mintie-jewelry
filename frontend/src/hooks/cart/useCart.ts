import { useState, useEffect } from 'react';
import { Cart, CartItem } from '../../types/cart';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const price = item.product.sale_price || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => 
          cartItem.product.id === item.product.id && 
          cartItem.size === item.size
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex].quantity += item.quantity;
      } else {
        newItems = [...prevCart.items, item];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => !(item.product.id === productId && item.size === size)
      );
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
      return {
        items: newItems,
        total: calculateTotal(newItems)
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    items: cart.items,
    total: cart.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}; 