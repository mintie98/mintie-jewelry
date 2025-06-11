import React from 'react';
import { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, size: string, quantity: number) => void;
  onRemove: (productId: number, size: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const mainImage = item.product.images?.find(img => img.is_primary)?.image_url || 
                   item.product.images?.[0]?.image_url || '';
  const price = item.product.sale_price || item.product.price;

  return (
    <div className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={mainImage}
          alt={item.product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            <p className="ml-4">{price.toLocaleString('vi-VN')}đ</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.product.sku}</p>
          <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.product.id}-${item.size}`} className="mr-2">
              Quantity
            </label>
            <select
              id={`quantity-${item.product.id}-${item.size}`}
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.product.id, item.size, parseInt(e.target.value))}
              className="rounded-md border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => onRemove(item.product.id, item.size)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 