import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  compareAtPrice?: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  categorySlug?: string;
  stock?: number;
  [key: string]: any;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  freeDeliveryThreshold: number;
  freeShippingProgress: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);
const CART_STORAGE_KEY = "@vedika_cart_items";
const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);

  // Load cart from AsyncStorage on startup
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Error loading cart:", e);
      }
    })();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  const saveCart = async (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn("Error saving cart:", e);
    }
  };

  const addToCart = (product: CartProduct, quantity = 1) => {
    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...items, { product, quantity }];
    }
    saveCart(updated);
  };

  const updateQuantity = (productId: string, newQty: number) => {
    let updated: CartItem[];
    if (newQty <= 0) {
      updated = items.filter((i) => i.product.id !== productId);
    } else {
      updated = items.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
    }
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter((i) => i.product.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setDiscount(0);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : STANDARD_SHIPPING_FEE;

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const total = Math.max(0, subtotal + shippingFee - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeDeliveryThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
