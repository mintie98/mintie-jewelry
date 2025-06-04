import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho Sản phẩm dựa trên API backend
interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  is_featured: boolean;
  is_active: boolean;
  variants: {
    id: number;
    sku: string;
    price: number;
    sale_price: number | null;
    is_active: boolean;
    images: {
      id: number;
      image_url: string;
      is_primary: boolean;
      display_order: number;
    }[];
  }[];
}

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [products, setProducts] = useState<Product[]>([]); // Sử dụng kiểu Product[]
  const [loading, setLoading] = useState<boolean>(true); // Sử dụng kiểu boolean
  const [error, setError] = useState<any>(null); // Sử dụng kiểu any để xử lý lỗi chung
  const [sortOption, setSortOption] = useState<string>('newest'); // State cho tùy chọn sắp xếp

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://localhost:5001/api/products/'); // Sửa: Thêm dấu / ở cuối URL
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Logic lọc sản phẩm theo category sử dụng category_slug từ API
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category_slug === selectedCategory); // Lọc theo category_slug

  // Thêm logic lọc theo khoảng giá
  const productsAfterPriceFilter = filteredProducts.filter(product => {
    const price = product.variants[0]?.price || 0;
    return price >= priceRange[0] && price <= priceRange[1];
  });

  // Thêm logic sắp xếp
  const sortedProducts = [...productsAfterPriceFilter].sort((a, b) => {
    if (sortOption === 'price-asc') {
      const priceA = a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.price || 0;
      return priceA - priceB;
    } else if (sortOption === 'price-desc') {
      const priceA = a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.price || 0;
      return priceB - priceA;
    } else {
      return b.id - a.id;
    }
  });

  if (loading) {
    return <div className="container mx-auto py-8">Đang tải sản phẩm...</div>;
  }

  if (error) {
    // Hiển thị lỗi chi tiết hơn nếu có
    return <div className="container mx-auto py-8 text-red-500">Lỗi khi tải sản phẩm: {error.message || 'Unknown Error'}</div>;
  }

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
                min="100000"
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
            <select
              className="border rounded-md px-4 py-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-120">
                  <div className="relative pb-4 pt-4 px-4">
                    <img
                      src={`http://localhost:5001${
                        product.variants[0]?.images.find(img => img.is_primary)?.image_url || 
                        product.variants[0]?.images[0]?.image_url || ''
                      }`}
                      alt={product.name}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 h-48">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gold-500 font-bold">
                      {product.variants[0]?.price.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                    </p>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-3">{product.description}</p>
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

export default Products; 