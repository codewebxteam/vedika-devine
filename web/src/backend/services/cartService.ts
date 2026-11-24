import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";
import { CartItem } from "../types/cart";

export const saveUserCart = async (userId: string, items: CartItem[]): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTIONS.CARTS, userId);
    await setDoc(docRef, {
      userId,
      items,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.warn("Could not sync cart to firestore:", error);
  }
};

export const getUserCart = async (userId: string): Promise<CartItem[]> => {
  try {
    const docRef = doc(db, COLLECTIONS.CARTS, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
  } catch (error) {
    console.warn("Could not fetch cart from firestore:", error);
  }
  return [];
};
