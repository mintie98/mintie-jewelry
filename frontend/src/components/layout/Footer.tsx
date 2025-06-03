import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">MINTIE JEWELRY</h3>
            <p className="text-gray-400 mb-4">
              Chuyên cung cấp các sản phẩm trang sức cao cấp, vàng bạc đá quý.
            </p>
            <div className="text-gray-400">
              <p>Hotline: 000 0000 0000</p>
              <p>Email: info@mintie-jewelry.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold-500">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-gold-500">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-400 hover:text-gold-500">
                  Bộ sưu tập
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold-500">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chăm sóc khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-gold-500">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-gold-500">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-gold-500">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-gold-500">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h3>
            <p className="text-gray-400 mb-4">
              Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button
                type="submit"
                className="w-full btn btn-primary"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MINTIE JEWELRY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 