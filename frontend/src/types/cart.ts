import { Product } from './product';

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
} 