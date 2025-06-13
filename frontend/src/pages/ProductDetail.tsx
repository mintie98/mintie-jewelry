import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// import { StarIcon } from '@heroicons/react/24/solid'; // Uncomment if using actual star icons

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; // Optional: if you want pagination

// import required modules
import { Navigation } from 'swiper/modules';

interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

interface ProductSize {
  size: string;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  sale_price: number | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  sizes_quantities: ProductSize[];
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${slug}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          const primaryImage = response.data.images.find(
            (img: ProductImage) => img.is_primary
          );
          if (primaryImage) {
            setSelectedImage(primaryImage.image_url);
          } else if (response.data.images.length > 0) {
            setSelectedImage(response.data.images[0].image_url);
          } else {
            setSelectedImage(null);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Error loading product details');
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${slug}/related`);
        setRelatedProducts(response.data);
      } catch (err) {
        console.error('Error loading related products:', err);
      }
    };

    fetchProduct();
    fetchRelatedProducts();
  }, [slug]);

  const handleImageClick = (image: ProductImage, index: number) => {
    setSelectedImage(image.image_url);
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && selectedSize) {
      const sizeQuantity = product?.sizes_quantities.find(q => q.size === selectedSize);
      if (sizeQuantity && newQuantity <= sizeQuantity.quantity) {
        setQuantity(newQuantity);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error || !product) {
    return <div className="container mx-auto py-8 text-red-500">{error || 'Product not found'}</div>;
  }

  const currentImageIndex = product.images.findIndex(img => img.image_url === selectedImage) || 0;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images - Main Image */}
        <div className="relative space-y-4 w-4/5 mx-auto">
           {product.images.length > 0 && selectedImage && (
             <div className="relative">
                {/* Main Image Display */}
                <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                        src={`http://localhost:5001/uploads${selectedImage}`}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                    />
                 </div>
                {/* Placeholder for Pagination */}
                <div className="bg-white inline-block py-[2px] px-[6px] text-[10px] rounded-lg absolute bottom-[5px] left-[50%] translate-x-[-50%] z-10">
                  <p>{product.images.length > 0 ? `${currentImageIndex + 1}/${product.images.length}` : '0/0'}</p>
                </div>
             </div>
           )}

          {/* Thumbnail Gallery */}
          {product.images.length > 0 && (
            <div className="swiper-thumbnail-container mt-4">
              {product.images.length > 4 ? (
                <Swiper
                  slidesPerView={4}
                  spaceBetween={10}
                  navigation={true}
                  modules={[Navigation]}
                  loop={true}
                  className="myThumbsSwiper"
                  onSwiper={(swiper: SwiperType) => {
                    swiperRef.current = swiper;
                  }}
                  onSlideChange={(swiper: SwiperType) => {
                    const realIndex = swiper.realIndex;
                    if (product.images[realIndex]) {
                      setSelectedImage(product.images[realIndex].image_url);
                      setSelectedImageIndex(realIndex);
                    }
                  }}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={image.id}>
                      <button
                        onClick={() => handleImageClick(image, index)}
                        className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                          selectedImage === image.image_url ? 'ring-2 ring-gold-500' : ''
                        }`}
                      >
                        <img
                          src={`http://localhost:5001/uploads${image.image_url}`}
                          alt={`${product.name} - Image ${image.display_order}`}
                          className="w-full h-24 object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.image_url)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${ selectedImage === image.image_url ? 'ring-2 ring-gold-500' : ''}`}
                    >
                      <img
                        src={`http://localhost:5001/uploads${image.image_url}`}
                        alt={`${product.name} - Image ${image.display_order}`}
                        className="w-full h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating - Template Placeholder */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-300">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.106 21.4c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007Z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              (0 đánh giá)
            </span>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-gold-500">
            {Math.floor(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes_quantities && product.sizes_quantities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Chọn size</h3>
              <div className="flex flex-wrap gap-1">
                {product.sizes_quantities
                  .sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
                  .map((q) => (
                    <button
                      key={q.size}
                      onClick={() => handleSizeChange(q.size)}
                      disabled={q.quantity === 0}
                      className={`aspect-square w-10 h-10 flex items-center justify-center border rounded-lg text-sm font-medium ${
                        selectedSize === q.size
                          ? 'border-gold-500 bg-gold-50 text-gold-500'
                          : q.quantity === 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gold-500'
                      }`}
                    >
                      {q.size}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {selectedSize && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-1 border rounded-l-md hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  className="w-16 text-center border-t border-b [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 border rounded-r-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            disabled={!selectedSize}
            className={`w-full py-3 px-6 rounded-lg transition-colors ${
              selectedSize
                ? 'bg-gold-500 text-white hover:bg-gold-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedSize ? 'Thêm vào giỏ hàng' : 'Vui lòng chọn size'}
          </button>

          {/* Product Details */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 text-gray-600">Danh mục:</span>
                <span>{product.category.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600">Mã sản phẩm:</span>
                <span>{product.sku}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.slug}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative pb-[100%]">
                    <img
                      src={`http://localhost:5001/uploads${
                        relatedProduct.images && relatedProduct.images.length > 0
                        ? (relatedProduct.images.find((img: ProductImage) => img.is_primary) || relatedProduct.images[0]).image_url
                        : ''
                      }`}
                      alt={relatedProduct.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                    <p className="text-gold-500 font-bold">
                      {Math.floor(relatedProduct.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;