export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductSize {
  size: string;
  quantity: number;
  price: number;
}

export interface Product {
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

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 