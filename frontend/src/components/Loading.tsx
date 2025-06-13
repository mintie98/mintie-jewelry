import React from 'react';
import './Loading.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8',
    medium: 'w-12',
    large: 'w-16'
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50">
      <div className="flex flex-col items-center">
        <div 
          className={`${sizeClasses[size]} loader`}
          style={{
            '--b': '8px'
          } as React.CSSProperties}
        />
        <p className="mt-4 text-lg font-medium text-gray-600 animate-pulse">Đang tải...</p>
      </div>
    </div>
  );
};

export default Loading; 