import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  product_count: number;
}

const Home: React.FC = () => {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/categories/featured');
        setFeaturedCategories(response.data);
      } catch (err) {
        setError('Failed to load featured categories');
        console.error('Error fetching featured categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCategories();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  MinTie Jewelry Store
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Khám phá bộ sưu tập trang sức độc đáo của chúng tôi
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Link
                    to="/products"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Xem sản phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2">
            <img
              src="http://localhost:5001/uploads/pages/hero.jpg"
              alt="MinTie Jewelry Store"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Danh Mục Nổi Bật</h2>
          <div className="grid grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.id}`} 
                className="group"
                onClick={() => console.log('Selected category:', category)}
              >
                <div className="overflow-hidden rounded-lg aspect-square">
                  <img
                    src={`http://localhost:5001${category.image_url}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-2 text-center text-gray-700 font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Sản Phẩm Nổi Bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg bg-white shadow-md">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gold-500 font-bold">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Mock data
const featuredProducts = [
  {
    id: 1,
    name: 'Nhẫn Kim Cương 18K',
    price: '15.000.000đ',
    image: 'http://localhost:5001/uploads/diamond-ring.jpg',
  },
  {
    id: 2,
    name: 'Dây Chuyền Vàng 24K',
    price: '8.500.000đ',
    image: 'http://localhost:5001/uploads/gold-necklace.jpg',
  },
  {
    id: 3,
    name: 'Bông Tai Ngọc Trai',
    price: '3.200.000đ',
    image: 'http://localhost:5001/uploads/pearl-earrings.jpg',
  },
  {
    id: 4,
    name: 'Lắc Tay Vàng 18K',
    price: '12.000.000đ',
    image: 'http://localhost:5001/uploads/gold-bracelet.jpg',
  },
];

export default Home; 