import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { imageUrl, minPrice, maxPrice, hasPriceRange } = useMemo(() => {
    const mainImage = product.images?.find(img => img.is_primary)?.image_url || 
                     product.images?.[0]?.image_url || '';
    const imageUrl = mainImage ? `http://localhost:5001/uploads${mainImage}` : '';

    // Calculate price range from sizes_quantities
    const prices = product.sizes_quantities?.map(sq => sq.price).filter(price => price != null) || [];
    const basePrice = product.price != null ? product.price : 0;
    
    // If no prices in sizes_quantities, use base price
    if (prices.length === 0) {
      return {
        imageUrl,
        minPrice: basePrice,
        maxPrice: basePrice,
        hasPriceRange: false
      };
    }

    const minPrice = Math.min(...prices, basePrice);
    const maxPrice = Math.max(...prices, basePrice);
    const hasPriceRange = minPrice !== maxPrice;

    return {
      imageUrl,
      minPrice,
      maxPrice,
      hasPriceRange
    };
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).format(price);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-[280px]">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-t-lg bg-gray-200">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-sm font-medium text-gray-900 h-[40px] flex items-center justify-center">
            <Link to={`/products/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
          <div>
            {hasPriceRange ? (
              <p className="text-sm font-medium text-yellow-600">
                {formatPrice(minPrice)}đ - {formatPrice(maxPrice)}đ
              </p>
            ) : (
              <p className="text-sm font-medium text-yellow-600">
                {formatPrice(product.price)}đ
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 