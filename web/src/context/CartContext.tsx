"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, CartItem } from "@backend/index";
import { useAuth } from "./AuthContext";
import { saveUserCart, getUserCart } from "@backend/index";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  isCartDrawerOpen: false,
  setIsCartDrawerOpen: () => {},
});

const CART_STORAGE_KEY = "vedika_cart_items";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { user } = useAuth();

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Error reading cart from local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Sync with Firestore if logged in
  useEffect(() => {
    if (user && isLoaded) {
      getUserCart(user.uid).then((remoteItems) => {
        if (remoteItems && remoteItems.length > 0) {
          // Merge remote items with local
          setItems((prev) => {
            const merged = [...remoteItems];
            prev.forEach((localItem) => {
              const exists = merged.find((m) => m.productId === localItem.productId);
              if (!exists) {
                merged.push(localItem);
              }
            });
            return merged;
          });
        }
      });
    }
  }, [user, isLoaded]);

  // Persist cart to localStorage and optionally Firestore
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (user) {
        saveUserCart(user.uid, items);
      }
    } catch (e) {
      console.warn("Error persisting cart", e);
    }
  }, [items, isLoaded, user]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          price: product.price,
          addedAt: Date.now(),
        };
        return [...prev, newItem];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
