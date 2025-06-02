import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`block w-full text-left px-4 py-2 rounded-md ${
                    selectedCategory === category.id
                      ? 'bg-gold-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Khoảng Giá</h3>
            <div className="px-4">
              <input
                type="range"
                min="0"
                max="100000000"
                step="1000000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString()}đ</span>
                <span>{priceRange[1].toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tất cả sản phẩm</h2>
            <select className="border rounded-md px-4 py-2">
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 right-2 bg-gold-500 text-white px-2 py-1 rounded-md text-sm">
                        Mới
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gold-500 font-bold">{product.price}</p>
                    <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-1 rounded-md border hover:bg-gray-100">
                Trước
              </button>
              <button className="px-3 py-1 rounded-md bg-gold-500 text-white">
                1
              </button>
              <button className="px-3 py-1 rounded-md border hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1 rounded-md border hover:bg-gray-100">
                3
              </button>
              <button className="px-3 py-1 rounded-md border hover:bg-gray-100">
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data
const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'rings', name: 'Nhẫn' },
  { id: 'necklaces', name: 'Dây chuyền' },
  { id: 'earrings', name: 'Bông tai' },
  { id: 'bracelets', name: 'Lắc tay' },
];

const products = [
  {
    id: 1,
    name: 'Nhẫn Kim Cương 18K',
    price: '15.000.000đ',
    description: 'Nhẫn kim cương tự nhiên, vàng 18K',
    image: '/images/products/diamond-ring.jpg',
    isNew: true,
  },
  {
    id: 2,
    name: 'Dây Chuyền Vàng 24K',
    price: '8.500.000đ',
    description: 'Dây chuyền vàng 24K, thiết kế tinh tế',
    image: '/images/products/gold-necklace.jpg',
    isNew: false,
  },
  {
    id: 3,
    name: 'Bông Tai Ngọc Trai',
    price: '3.200.000đ',
    description: 'Bông tai ngọc trai tự nhiên, vàng 14K',
    image: '/images/products/pearl-earrings.jpg',
    isNew: true,
  },
  {
    id: 4,
    name: 'Lắc Tay Vàng 18K',
    price: '12.000.000đ',
    description: 'Lắc tay vàng 18K, đính kim cương',
    image: '/images/products/gold-bracelet.jpg',
    isNew: false,
  },
  {
    id: 5,
    name: 'Nhẫn Cưới Kim Cương',
    price: '25.000.000đ',
    description: 'Nhẫn cưới kim cương 1 carat, vàng 18K',
    image: '/images/products/wedding-ring.jpg',
    isNew: true,
  },
  {
    id: 6,
    name: 'Vòng Cổ Ngọc Trai',
    price: '5.500.000đ',
    description: 'Vòng cổ ngọc trai tự nhiên, vàng 14K',
    image: '/images/products/pearl-necklace.jpg',
    isNew: false,
  },
];

export default Products; 