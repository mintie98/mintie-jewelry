import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.variants[0]?.images.find(img => img.is_primary)?.image_url || 
                   product.variants[0]?.images[0]?.image_url || '';

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
        <img
          src={`http://localhost:5001${mainImage}`}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <p className="text-gold-500 font-bold">
            {product.variants[0]?.price.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
          </p>
        </div>
      </div>
    </Link>
  );
}; 