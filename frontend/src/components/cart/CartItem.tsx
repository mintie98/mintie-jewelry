import React from 'react';
import { CartItem as CartItemType } from '../../types/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const mainImage = item.variant.images.find(img => img.is_primary)?.image_url || 
                   item.variant.images[0]?.image_url || '';
  const price = item.variant.sale_price || item.variant.price;

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={`http://localhost:5001${mainImage}`}
          alt={item.product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">Size: {item.size}</p>
        <p className="text-gold-500 font-bold">
          {price.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onUpdateQuantity(item.quantity - 1)}
          className="px-2 py-1 border rounded-l"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.quantity + 1)}
          className="px-2 py-1 border rounded-r"
        >
          +
        </button>
        <button
          onClick={onRemove}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
}; 