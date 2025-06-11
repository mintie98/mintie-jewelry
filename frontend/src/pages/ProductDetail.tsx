import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types/product';
import { useCart } from '../hooks/cart/useCart';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/products/${slug}`);
        setProduct(response.data);
        
        // Get related products
        const relatedResponse = await axios.get(`http://localhost:5001/api/products/${response.data.id}/related`);
        setRelatedProducts(relatedResponse.data);

        // Set initial size if available
        if (response.data.sizes_quantities?.length > 0) {
          setSelectedSize(response.data.sizes_quantities[0].size);
        }

        if (response.data.images && response.data.images.length > 0) {
          const mainImage = response.data.images.find((img: any) => img.is_primary)?.image_url || response.data.images[0].image_url;
          setSelectedImage(mainImage);
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    const sizeQuantity = product.sizes_quantities.find(sq => sq.size === selectedSize);
    if (!sizeQuantity || sizeQuantity.quantity < quantity) {
      alert('Số lượng không đủ');
      return;
    }

    addToCart({
      product,
      size: selectedSize,
      quantity
    });

    alert('Đã thêm vào giỏ hàng');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  const mainImage = selectedImage ? `/uploads${selectedImage}` : '';

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">Product information</h2>
            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl">
                {product.sale_price ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-red-600">
                      {product.sale_price.toLocaleString('vi-VN')}đ
                    </span>
                  </>
                ) : (
                  product.price.toLocaleString('vi-VN') + 'đ'
                )}
              </p>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center">
              <div className="flex items-center">
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="options-heading" className="mt-6">
            <h2 id="options-heading" className="sr-only">Product options</h2>

            <form>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {product.sizes_quantities.map((sizeQuantity) => (
                    <button
                      key={sizeQuantity.size}
                      type="button"
                      onClick={() => setSelectedSize(sizeQuantity.size)}
                      className={`group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none ${
                        selectedSize === sizeQuantity.size
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-300'
                      }`}
                    >
                      {sizeQuantity.size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                </div>

                <div className="mt-2">
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  Add to cart
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {product.images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.image_url)}
                className={`relative overflow-hidden rounded-lg ${
                  selectedImage === image.image_url ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <img
                  src={`/uploads${image.image_url}`}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;