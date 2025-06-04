import { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { productService } from '../../services/product';

export const useProduct = (id?: number) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (id) {
          const productData = await productService.getProductById(id);
          setProduct(productData);
          
          const relatedData = await productService.getRelatedProducts(id);
          setRelatedProducts(relatedData);
        }
        setError(null);
      } catch (err) {
        setError('Error loading product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, relatedProducts, loading, error };
}; 