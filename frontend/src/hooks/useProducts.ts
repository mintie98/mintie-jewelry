import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types/product';

export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const page = searchParams.get('page') || '1';
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort');

        console.log('=== Frontend Request Details ===');
        console.log('URL Search Params:', Object.fromEntries(searchParams.entries()));
        console.log('Parsed Parameters:', {
          page,
          category,
          minPrice,
          maxPrice,
          sort
        });

        const response = await axios.get('http://localhost:5001/api/products', {
          params: {
            page,
            limit: 12,
            category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            sort: sort || 'newest'
          }
        });

        console.log('=== Frontend Response ===');
        console.log('API Response:', response.data);
        console.log('Products count:', response.data.products.length);
        console.log('Price range in response:', {
          min: Math.min(...response.data.products.map((p: any) => parseFloat(p.price))),
          max: Math.max(...response.data.products.map((p: any) => parseFloat(p.price)))
        });
        if (response.data.filters?.category) {
          console.log('Category filter:', response.data.filters.category);
        }

        // Format products to match the Product type
        const formattedProducts = response.data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          sku: product.sku,
          price: parseFloat(product.price),
          sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
          category: {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug
          },
          is_featured: product.is_featured,
          is_active: product.is_active,
          created_at: product.created_at,
          updated_at: product.updated_at,
          images: product.images || [],
          sizes_quantities: product.sizes_quantities || []
        }));

        setProducts(formattedProducts);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.page);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return { products, isLoading, error, totalPages, currentPage };
}; 