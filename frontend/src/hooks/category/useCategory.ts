import { useState, useEffect } from 'react';
import { Category } from '../../types/category';
import { categoryService } from '../../services/category';

export const useCategory = (id?: number, slug?: string) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await categoryService.getCategoryById(id);
          setCategory(data);
        } else if (slug) {
          const data = await categoryService.getCategoryBySlug(slug);
          setCategory(data);
        }
        setError(null);
      } catch (err) {
        setError('Error loading category');
        console.error('Error fetching category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, slug]);

  return { category, loading, error };
}; 