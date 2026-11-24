"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getUserWishlist, toggleWishlistItem } from "@backend/index";

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  toggleWishlist: async () => {},
  isInWishlist: () => false,
});

const WISHLIST_STORAGE_KEY = "vedika_wishlist_ids";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Error reading wishlist", e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      getUserWishlist(user.uid).then((ids) => {
        if (ids && ids.length > 0) {
          setWishlistIds(ids);
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
        }
      });
    }
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    let next: string[] = [];
    if (wishlistIds.includes(productId)) {
      next = wishlistIds.filter((id) => id !== productId);
    } else {
      next = [...wishlistIds, productId];
    }
    setWishlistIds(next);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));

    if (user) {
      await toggleWishlistItem(user.uid, productId);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
