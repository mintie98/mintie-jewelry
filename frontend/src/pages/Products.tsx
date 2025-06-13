import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Loading from '../components/Loading';
import { Product } from '../types/product';

interface Attribute {
  id: number;
  name: string;
  display_name: string;
  values: {
    id: number;
    value: string;
  }[];
}

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, number[]>>({});
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([2000000, 200000000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isFiltering, setIsFiltering] = useState(false);
  
  const currentPage = Number(searchParams.get('page')) || 1;
  const categoryId = searchParams.get('category');

  // Initialize price range from URL params
  useEffect(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/attributes');
        console.log('Attributes response:', response.data);
        setAttributes(response.data);
      } catch (err) {
        console.error('Error fetching attributes:', err);
      }
    };

    fetchAttributes();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setIsFiltering(true);
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        if (categoryId) params.append('category', categoryId);
        if (sortBy) params.append('sort', sortBy);
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());
        
        // Add attribute filters
        Object.entries(selectedFilters).forEach(([attributeId, valueIds]) => {
          if (valueIds.length > 0) {
            params.append(`attributes[${attributeId}]`, valueIds.join(','));
          }
        });

        console.log('Fetching products with params:', params.toString());

        const response = await axios.get(`http://localhost:5001/api/products?${params.toString()}`);
        console.log('Products response:', response.data);
        
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / response.data.per_page));
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
        // Thêm delay nhỏ để tránh hiệu ứng nhấp nháy
        setTimeout(() => {
          setIsFiltering(false);
        }, 300);
      }
    };

    fetchProducts();
  }, [currentPage, categoryId, sortBy, priceRange, selectedFilters]);

  const handleFilterChange = (attributeId: number, valueId: number) => {
    setSelectedFilters(prev => {
      const currentValues = prev[attributeId] || [];
      const newValues = currentValues.includes(valueId)
        ? currentValues.filter(id => id !== valueId)
        : [...currentValues, valueId];
      
      return {
        ...prev,
        [attributeId]: newValues
      };
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  // Handle price range change
  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    setSearchParams((prev: URLSearchParams) => {
      prev.set('minPrice', newRange[0].toString());
      prev.set('maxPrice', newRange[1].toString());
      return prev;
    });
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setSearchParams((prev: URLSearchParams) => {
      prev.set('sort', newSort);
      return prev;
    });
  };

  if (loading && !isFiltering) {
    return <Loading />;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* Price Range Filter */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Khoảng giá</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="2000000"
                max="200000000"
                step="1000000"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  if (newMin <= priceRange[1]) {
                    handlePriceRangeChange([newMin, priceRange[1]]);
                  }
                }}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>

          {/* All Filters */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bộ lọc sản phẩm</h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Độ tuổi vàng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ tuổi vàng</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(1, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">18K</option>
                  <option value="2">14K</option>
                  <option value="3">10K</option>
                </select>
              </div>

              {/* Màu sắc kim loại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc kim loại</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(2, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">Vàng</option>
                  <option value="2">Trắng</option>
                  <option value="3">Hồng</option>
                </select>
              </div>

              {/* Loại đá chủ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại đá chủ</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(3, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">Kim cương</option>
                  <option value="2">Ruby</option>
                  <option value="3">Sapphire</option>
                  <option value="4">Emerald</option>
                </select>
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(4, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">Nam</option>
                  <option value="2">Nữ</option>
                  <option value="3">Unisex</option>
                </select>
              </div>

              {/* Nước kim cương */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nước kim cương</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(5, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">D</option>
                  <option value="2">E</option>
                  <option value="3">F</option>
                  <option value="4">G</option>
                  <option value="5">H</option>
                  <option value="6">I</option>
                  <option value="7">J</option>
                  <option value="8">K</option>
                </select>
              </div>

              {/* Độ tinh khiết */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ tinh khiết</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(6, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">FL</option>
                  <option value="2">IF</option>
                  <option value="3">VVS1</option>
                  <option value="4">VVS2</option>
                  <option value="5">VS1</option>
                  <option value="6">VS2</option>
                  <option value="7">SI1</option>
                  <option value="8">SI2</option>
                </select>
              </div>

              {/* Giác cắt KC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giác cắt KC</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(7, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">Excellent</option>
                  <option value="2">Very Good</option>
                  <option value="3">Good</option>
                  <option value="4">Fair</option>
                  <option value="5">Poor</option>
                </select>
              </div>

              {/* Trọng lượng chủ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trọng lượng chủ</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={(e) => handleFilterChange(8, parseInt(e.target.value))}
                >
                  <option value="">Tất cả</option>
                  <option value="1">0.1 - 0.5 carat</option>
                  <option value="2">0.5 - 1 carat</option>
                  <option value="3">1 - 2 carat</option>
                  <option value="4">2 - 3 carat</option>
                  <option value="5">3 - 4 carat</option>
                  <option value="6">4 - 5 carat</option>
                  <option value="7">Trên 5 carat</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="mb-6 flex justify-end">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>

          {/* Products */}
          <div className="relative">
            {isFiltering && <Loading />}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="flex justify-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === page ? 'bg-indigo-600 text-white' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Sau
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 