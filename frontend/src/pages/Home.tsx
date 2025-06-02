import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
          <div className="container mx-auto h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">
                Trang Sức Cao Cấp
              </h1>
              <p className="text-xl mb-8">
                Khám phá bộ sưu tập trang sức độc đáo, được thiết kế tinh tế với chất liệu cao cấp.
              </p>
              <Link
                to="/products"
                className="btn btn-primary text-lg px-8 py-3"
              >
                Khám phá ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Danh Mục Nổi Bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="group relative h-80 overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
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
const categories = [
  {
    id: 1,
    name: 'Nhẫn',
    image: '/images/categories/rings.jpg',
    link: '/products?category=rings',
  },
  {
    id: 2,
    name: 'Dây Chuyền',
    image: '/images/categories/necklaces.jpg',
    link: '/products?category=necklaces',
  },
  {
    id: 3,
    name: 'Bông Tai',
    image: '/images/categories/earrings.jpg',
    link: '/products?category=earrings',
  },
];

const featuredProducts = [
  {
    id: 1,
    name: 'Nhẫn Kim Cương 18K',
    price: '15.000.000đ',
    image: '/images/products/diamond-ring.jpg',
  },
  {
    id: 2,
    name: 'Dây Chuyền Vàng 24K',
    price: '8.500.000đ',
    image: '/images/products/gold-necklace.jpg',
  },
  {
    id: 3,
    name: 'Bông Tai Ngọc Trai',
    price: '3.200.000đ',
    image: '/images/products/pearl-earrings.jpg',
  },
  {
    id: 4,
    name: 'Lắc Tay Vàng 18K',
    price: '12.000.000đ',
    image: '/images/products/gold-bracelet.jpg',
  },
];

export default Home; 