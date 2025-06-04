import React from 'react';
import { CartItem } from '../../components/cart/CartItem';
import { useCart } from '../../hooks/cart/useCart';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.variant.id}-${item.size}`}
              item={item}
              onUpdateQuantity={(quantity) => updateQuantity(item, quantity)}
              onRemove={() => removeFromCart(item)}
            />
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{cart.total.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{cart.total.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => clearCart()}
              className="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
            <button
              className="w-full mt-4 py-2 px-4 bg-gold-500 text-white rounded hover:bg-gold-600"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 