import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartProduct } from "./CartContext";

interface WishlistContextType {
  items: CartProduct[];
  wishlistIds: string[];
  wishlistItems: CartProduct[];
  toggleWishlist: (product: CartProduct) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType);
const WISHLIST_STORAGE_KEY = "@vedika_wishlist_items";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<CartProduct[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          setWishlistItems(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Error loading wishlist:", e);
      }
    })();
  }, []);

  const saveWishlist = async (items: CartProduct[]) => {
    setWishlistItems(items);
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Error saving wishlist:", e);
    }
  };

  const toggleWishlist = (product: CartProduct) => {
    const exists = wishlistItems.some((i) => i.id === product.id);
    let updated: CartProduct[];
    if (exists) {
      updated = wishlistItems.filter((i) => i.id !== product.id);
    } else {
      updated = [...wishlistItems, product];
    }
    saveWishlist(updated);
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistItems.filter((i) => i.id !== productId);
    saveWishlist(updated);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((i) => i.id === productId);
  };

  const wishlistIds = wishlistItems.map((i) => i.id);

  return (
    <WishlistContext.Provider
      value={{
        items: wishlistItems,
        wishlistIds,
        wishlistItems,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
