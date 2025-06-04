import { Product, ProductVariant } from './product';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  size: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
} 