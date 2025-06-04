export interface ProductImage {
  id: number;
  variant_id: number;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface ProductQuantity {
  size: string;
  quantity: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  sale_price: number | null;
  is_active: boolean;
  images: ProductImage[];
  quantities: ProductQuantity[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  is_featured: boolean;
  is_active: boolean;
  variants: ProductVariant[];
} 