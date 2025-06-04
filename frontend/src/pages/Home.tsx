import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="http://localhost:5001/uploads/Jewelry-background.jpg"
            alt="Jewelry Background"
            className="w-full h-full object-cover"
          />
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
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Danh Mục Nổi Bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/products?category=rings" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="http://localhost:5001/uploads/diamond-ring.jpg"
                  alt="Nhẫn"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">Nhẫn</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=necklaces" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="http://localhost:5001/uploads/gold-necklace.jpg"
                  alt="Dây chuyền"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">Dây chuyền</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=earrings" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="http://localhost:5001/uploads/pearl-earrings.jpg"
                  alt="Bông tai"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">Bông tai</h3>
                </div>
              </div>
            </Link>
            <Link to="/products?category=bracelets" className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src="http://localhost:5001/uploads/gold-bracelet.jpg"
                  alt="Vòng tay"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">Vòng tay</h3>
                </div>
              </div>
            </Link>
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