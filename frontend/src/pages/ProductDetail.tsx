import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in real app, this would come from an API
  const product = {
    id: 1,
    name: 'Nhẫn Kim Cương 18K',
    price: '15.000.000đ',
    description: 'Nhẫn kim cương tự nhiên, vàng 18K. Thiết kế tinh tế, sang trọng.',
    images: [
      '/images/products/diamond-ring-1.jpg',
      '/images/products/diamond-ring-2.jpg',
      '/images/products/diamond-ring-3.jpg',
    ],
    details: {
      material: 'Vàng 18K',
      stone: 'Kim cương tự nhiên',
      weight: '3.5g',
      size: 'Size 12-18',
    },
    rating: 4.5,
    reviews: 128,
  };

  const relatedProducts = [
    {
      id: 2,
      name: 'Nhẫn Cưới Kim Cương',
      price: '25.000.000đ',
      image: '/images/products/wedding-ring.jpg',
    },
    {
      id: 3,
      name: 'Nhẫn Hôn Lễ',
      price: '18.500.000đ',
      image: '/images/products/engagement-ring.jpg',
    },
    {
      id: 4,
      name: 'Nhẫn Kim Cương Đơn Giản',
      price: '12.000.000đ',
      image: '/images/products/simple-diamond-ring.jpg',
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="relative h-96 mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-24 rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-gold-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.reviews} đánh giá)
            </span>
          </div>
          <p className="text-2xl font-bold text-gold-500 mb-6">
            {product.price}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                className="w-16 text-center border-t border-b"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded-r-md"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button className="w-full btn btn-primary mb-4">
            Thêm vào giỏ hàng
          </button>
          <button className="w-full btn btn-secondary">
            Mua ngay
          </button>

          {/* Product Details */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
            <div className="space-y-2">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="w-32 text-gray-600">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gold-500 font-bold">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 