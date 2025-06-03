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
  variant_id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  is_active: boolean;
}

interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  sale_price: number | null;
  stock: number;
  is_active: boolean;
  images: ProductImage[];
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  is_featured: boolean;
  is_active: boolean;
  variants: ProductVariant[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          const initialVariant = response.data.variants[0];
          setSelectedVariant(initialVariant);
          const primaryImage = initialVariant.images.find(
            (img: ProductImage) => img.is_primary
          );
          if (primaryImage) {
            setSelectedImage(primaryImage.image_url);
          } else if (initialVariant.images.length > 0) {
            setSelectedImage(initialVariant.images[0].image_url);
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
        const response = await axios.get(`http://localhost:5001/api/products/related/${id}`);
        setRelatedProducts(response.data);
      } catch (err) {
        console.error('Error loading related products:', err);
      }
    };

    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
       const initialVariant = product.variants[0];
       setSelectedVariant(initialVariant);
       const primaryImage = initialVariant.images.find((img: ProductImage) => img.is_primary);
       if (primaryImage) {
         setSelectedImage(primaryImage.image_url);
       } else if (initialVariant.images.length > 0) {
          setSelectedImage(initialVariant.images[0].image_url);
       } else {
          setSelectedImage(null);
       }
    }
  }, [product]);

  const handleImageClick = (image: ProductImage, index: number) => {
    setSelectedImage(image.image_url);
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error || !product) {
    return <div className="container mx-auto py-8 text-red-500">{error || 'Product not found'}</div>;
  }

  const currentImageIndex = selectedVariant?.images.findIndex(img => img.image_url === selectedImage) || 0;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images - Main Image */}
        <div className="relative space-y-4 w-4/5 mx-auto">
           {selectedVariant && selectedVariant.images.length > 0 && selectedImage && (
             <div className="relative">
                {/* Main Image Display */}
                <div className="aspect-w-1 aspect-h-1 w-full">
                    <img
                        src={`http://localhost:5001${selectedImage}`}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                    />
                 </div>
                {/* Placeholder for Pagination */}
                <div className="bg-white inline-block py-[2px] px-[6px] text-[10px] rounded-lg absolute bottom-[5px] left-[50%] translate-x-[-50%] z-10">
                  <p>{selectedVariant.images.length > 0 ? `${currentImageIndex + 1}/${selectedVariant.images.length}` : '0/0'}</p>
                </div>
             </div>
           )}

          {/* Thumbnail Gallery */}
          {selectedVariant && selectedVariant.images.length > 0 && (
            <div className="swiper-thumbnail-container mt-4"> {/* This container needs to be relative */}
              {selectedVariant.images.length > 4 ? (
                // Use Swiper for more than 4 images
                // The Swiper component itself will be relative due to default Swiper CSS
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
                    if (selectedVariant?.images[realIndex]) {
                      setSelectedImage(selectedVariant.images[realIndex].image_url);
                      setSelectedImageIndex(realIndex);
                    }
                  }}
                >
                  {selectedVariant.images.map((image, index) => (
                    <SwiperSlide key={image.id}>
                      <button
                        onClick={() => handleImageClick(image, index)}
                        className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                          selectedImage === image.image_url ? 'ring-2 ring-gold-500' : ''
                        }`}
                      >
                        <img
                          src={`http://localhost:5001${image.image_url}`}
                          alt={`${product.name} - Image ${image.display_order}`}
                          className="w-full h-24 object-cover"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                // Use grid for 4 or fewer images
                <div className="grid grid-cols-4 gap-2">
                  {selectedVariant.images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image.image_url)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${ selectedImage === image.image_url ? 'ring-2 ring-gold-500' : ''}`}
                    >
                      <img
                        src={`http://localhost:5001${image.image_url}`}
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
              (0 đánh giá) {/* Placeholder value */}
            </span>
          </div>

          {/* Price */}
          {selectedVariant && (
            <div className="text-2xl font-bold text-gold-500">
              {selectedVariant.sale_price ? (
                <>
                  <span className="line-through text-gray-500 mr-2">
                    {(parseFloat(selectedVariant.price as any)).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                  </span>
                  {(parseFloat(selectedVariant.sale_price as any)).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ
                </>
              ) : (
                `${(parseFloat(selectedVariant.price as any)).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ`
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Available Variants</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      const primaryImage = variant.images.find((img) => img.is_primary);
                      if (primaryImage) {
                        setSelectedImage(primaryImage.image_url);
                      } else if (variant.images.length > 0) {
                         setSelectedImage(variant.images[0].image_url);
                      } else {
                         setSelectedImage(null);
                      }
                    }}
                    className={`p-2 border rounded-lg ${ selectedVariant?.id === variant.id ? 'border-gold-500 bg-gold-50' : 'border-gray-200'}`}
                  >
                    <div className="text-sm font-medium">{variant.sku}</div>
                    <div className="text-sm text-gray-500">
                      {variant.price.toLocaleString('vi-VN')}đ
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity - Template Placeholder */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng
            </label>
            <div className="flex items-center">
              <button
                className="px-3 py-1 border rounded-l-md"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={1} // Placeholder value
                readOnly // Make it read-only as it's a template
                className="w-16 text-center border-t border-b"
              />
              <button
                className="px-3 py-1 border rounded-r-md"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-gold-500 text-white py-3 px-6 rounded-lg hover:bg-gold-600 transition-colors">
            Add to Cart
          </button>

          {/* Product Details - Template Placeholder */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
            <div className="space-y-2">
              <div className="flex">
                <span className="w-32 text-gray-600">Chất liệu:</span>
                <span>Đang cập nhật</span> {/* Placeholder value */}
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600">Kích thước:</span>
                <span>Đang cập nhật</span> {/* Placeholder value */}
              </div>
              {/* Add more placeholder detail rows as needed */}
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative pb-[100%]">
                    <img
                      src={`http://localhost:5001${
                        relatedProduct.variants && relatedProduct.variants.length > 0 && relatedProduct.variants[0].images && relatedProduct.variants[0].images.length > 0
                        ? (relatedProduct.variants[0].images.find((img: ProductImage) => img.is_primary) || relatedProduct.variants[0].images[0]).image_url
                        : ''
                      }`}
                      alt={relatedProduct.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                    <p className="text-gold-500 font-bold">
                      {relatedProduct.variants && relatedProduct.variants.length > 0
                       ? `${relatedProduct.variants[0].price.toLocaleString('vi-VN')}đ`
                       : 'N/A'}
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