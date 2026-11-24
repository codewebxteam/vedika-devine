import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";
import { SAMPLE_PRODUCTS } from "./sampleProducts";
import { seedDefaultCategories, clearAllCategories } from "../services/categoryService";
import { clearAllProducts } from "../services/productService";

export const seedSampleProductsToFirestore = async (): Promise<{ count: number; error?: string }> => {
  try {
    // Also seed default categories into Firestore
    await seedDefaultCategories();

    let count = 0;
    for (const prod of SAMPLE_PRODUCTS) {
      const docRef = doc(db, COLLECTIONS.PRODUCTS, prod.id);
      await setDoc(docRef, prod);
      count++;
    }
    return { count };
  } catch (err: any) {
    console.error("Failed to seed sample products:", err);
    return { count: 0, error: err.message || "Failed to seed" };
  }
};

export const clearAllDummyData = async (): Promise<{ categoriesCleared: number; productsCleared: number }> => {
  const [cats, prods] = await Promise.all([
    clearAllCategories(),
    clearAllProducts(),
  ]);
  return {
    categoriesCleared: cats,
    productsCleared: prods,
  };
};
