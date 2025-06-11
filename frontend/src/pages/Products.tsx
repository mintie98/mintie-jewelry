import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types/product';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { useProducts } from '../hooks/useProducts';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, isLoading, totalPages, currentPage } = useProducts();

  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([2000000, 200000000]);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Initialize price range from URL params
  useEffect(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
  }, [searchParams]);

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

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-64 space-y-6">
            {/* Price Range */}
            <div>
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

            {/* Sort */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sắp xếp</h3>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <Loading size="large" />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500">
                  Không có sản phẩm nào phù hợp với bộ lọc của bạn. Vui lòng thử lại với bộ lọc khác.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setSearchParams((prev: URLSearchParams) => {
                    prev.set('page', (currentPage - 1).toString());
                    return prev;
                  })}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setSearchParams((prev: URLSearchParams) => {
                      prev.set('page', page.toString());
                      return prev;
                    })}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === page ? 'bg-indigo-600 text-white' : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setSearchParams((prev: URLSearchParams) => {
                    prev.set('page', (currentPage + 1).toString());
                    return prev;
                  })}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 