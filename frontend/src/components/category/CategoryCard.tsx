import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/category';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/products?category=${category.slug}`} className="group">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={`http://localhost:5001${category.image_url}`}
          alt={category.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-white text-xl font-semibold">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}; 