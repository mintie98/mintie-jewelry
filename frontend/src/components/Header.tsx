import React from 'react';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Liên hệ', href: '/contact' },
];

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Jewelry
          </Link>
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-600 hover:text-gray-900"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 