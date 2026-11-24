import { Product } from "./product";

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  addedAt?: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}
