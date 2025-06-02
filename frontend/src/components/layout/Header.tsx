import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto">
        {/* Top bar */}
        <div className="py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span>Hotline: 000 0000 0000</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-sm text-gray-600 hover:text-gold-500">
                Đăng nhập
              </Link>
              <Link to="/register" className="text-sm text-gray-600 hover:text-gold-500">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <img src="/jewelrylogo.png" alt="Mintie Jewelry Logo" style={{ height: 100 }} />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/products" className="text-gray-700 hover:text-gold-500">
                Sản phẩm
              </Link>
              <Link to="/collections" className="text-gray-700 hover:text-gold-500">
                Bộ sưu tập
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-gold-500">
                Giới thiệu
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-gold-500">
                Liên hệ
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-700 hover:text-gold-500"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <Link to="/cart" className="text-gray-700 hover:text-gold-500">
                <ShoppingCartIcon className="h-6 w-6" />
              </Link>
              <Link to="/account" className="text-gray-700 hover:text-gold-500">
                <UserIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gold-500">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 