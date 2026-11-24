import { collection, doc, getDocs, setDoc, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";
import { Review } from "../types/review";

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, COLLECTIONS.REVIEWS);
    const q = query(reviewsRef, where("productId", "==", productId));
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    snapshot.forEach((docSnap) => {
      reviews.push({ id: docSnap.id, ...docSnap.data() } as Review);
    });
    return reviews;
  } catch (error) {
    console.warn("Error fetching reviews:", error);
    return [];
  }
};

export const addReview = async (reviewData: Omit<Review, "id">): Promise<Review> => {
  const docRef = doc(collection(db, COLLECTIONS.REVIEWS));
  const review: Review = {
    ...reviewData,
    id: docRef.id,
  };
  await setDoc(docRef, review);
  return review;
};
