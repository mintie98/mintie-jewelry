import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types/product';

interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/products'),
          axios.get('http://localhost:5001/api/categories')
        ]);
        setProducts(productsRes.data.products);
        const featured = productsRes.data.products.filter((product: Product) => product.is_featured);
        setFeaturedProducts(featured);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading data');
        setLoading(false);
      }
    };

    fetchFeaturedCategories();
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="http://localhost:5001/uploads/pages/Jewelry-background.jpg"
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
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Khám phá bộ sưu tập trang sức độc đáo
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Được thiết kế tinh tế với chất liệu cao cấp
                  </p>
                  {/* Temporarily disabled
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                      to="/products"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Khám phá ngay
                    </Link>
                  </div>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Danh Mục Sản Phẩm</h2>
          <div className="grid grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.id}`} 
                className="group"
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Sản Phẩm Nổi Bật
            </h2>
            {featuredProducts.length > 0 ? (
              <div className="relative ">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={20}
                  slidesPerView={4}
                  navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                  }}
                  loop={true}
                  className="featured-products-swiper !py-10"
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 15
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 20
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 20
                    }
                  }}
                >
                  {featuredProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                      <div className="flex justify-center">
                        <ProductCard product={product} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="swiper-button-prev !w-10 !h-10 !bg-gray-100 !rounded-full !shadow-md !-left-5 !top-1/2 !-translate-y-1/2 !z-10 after:!text-xl after:!text-gray-400 hover:!bg-gray-200"></div>
                <div className="swiper-button-next !w-10 !h-10 !bg-gray-100 !rounded-full !shadow-md !-right-5 !top-1/2 !-translate-y-1/2 !z-10 after:!text-xl after:!text-gray-400 hover:!bg-gray-200"></div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Không có sản phẩm nổi bật</p>
            )}
            <div className="text-center mt-8">
              <Link
                to="/products?featured=true"
                className="inline-block px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors duration-300"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold text-center mb-12">Sản phẩm mới</h2>
            <div className="relative">
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                loop={true}
                className="featured-products-swiper !py-10"
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 15
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 20
                  }
                }}
              >
                {products.slice(0, 8).map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="flex justify-center">
                      <ProductCard product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-button-prev !w-10 !h-10 !bg-gray-100 !rounded-full !shadow-md !-left-5 !top-1/2 !-translate-y-1/2 !z-10 after:!text-xl after:!text-gray-400 hover:!bg-gray-200"></div>
              <div className="swiper-button-next !w-10 !h-10 !bg-gray-100 !rounded-full !shadow-md !-right-5 !top-1/2 !-translate-y-1/2 !z-10 after:!text-xl after:!text-gray-400 hover:!bg-gray-200"></div>
            </div>
            <div className="text-center mt-8">
              <Link
                to="/products?sort=newest"
                className="inline-block px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors duration-300"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Categories */}
      {/* <div className="container mx-auto py-16">
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Danh mục bán chạy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={`http://localhost:5001/uploads${category.image_url}`}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;