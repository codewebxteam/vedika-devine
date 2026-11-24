import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";

export const toggleWishlistItem = async (
  userId: string,
  productId: string
): Promise<string[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.WISHLISTS, userId);
    const docSnap = await getDoc(docRef);
    let items: string[] = [];

    if (docSnap.exists()) {
      items = docSnap.data().productIds || [];
    }

    if (items.includes(productId)) {
      items = items.filter((id) => id !== productId);
    } else {
      items.push(productId);
    }

    await setDoc(docRef, { userId, productIds: items, updatedAt: Date.now() });
    return items;
  } catch (error) {
    console.warn("Wishlist error:", error);
    return [];
  }
};

export const getUserWishlist = async (userId: string): Promise<string[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.WISHLISTS, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().productIds || [];
    }
  } catch (error) {
    console.warn("Wishlist fetch error:", error);
  }
  return [];
};
