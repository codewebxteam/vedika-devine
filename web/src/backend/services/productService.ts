import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";
import { Product, ProductFilterOptions } from "../types/product";
import { SAMPLE_PRODUCTS } from "../seeds/sampleProducts";

export const getProducts = async (options?: ProductFilterOptions): Promise<Product[]> => {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    let q = query(productsRef);

    if (options?.category) {
      q = query(q, where("categorySlug", "==", options.category));
    }

    if (options?.featuredOnly) {
      q = query(q, where("isFeatured", "==", true));
    }

    const querySnapshot = await getDocs(q);
    let products: Product[] = [];

    querySnapshot.forEach((docSnap) => {
      products.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });

    // Client-side / In-memory filtering & sorting
    if (options?.searchQuery) {
      const qLower = options.searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(qLower) ||
          p.description.toLowerCase().includes(qLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(qLower))
      );
    }

    if (options?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= (options.minPrice ?? 0));
    }
    if (options?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= (options.maxPrice ?? Infinity));
    }

    if (options?.sortBy) {
      switch (options.sortBy) {
        case "price-asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
        case "popular":
          products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          break;
        case "latest":
        default:
          break;
      }
    }

    return products;
  } catch (error) {
    console.warn("Firestore fetch error:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }

    // Also try lookup by slug
    const q = query(collection(db, COLLECTIONS.PRODUCTS), where("slug", "==", id), limit(1));
    const slugSnap = await getDocs(q);
    if (!slugSnap.empty) {
      const firstDoc = slugSnap.docs[0];
      return { id: firstDoc.id, ...firstDoc.data() } as Product;
    }
  } catch (error) {
    console.warn("Error fetching product by ID from Firestore:", error);
  }

  return null;
};

export const getFeaturedProducts = async (limitCount = 6): Promise<Product[]> => {
  const products = await getProducts({ featuredOnly: true });
  return products.slice(0, limitCount);
};

export const getBestSellers = async (limitCount = 4): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter((p) => p.isBestSeller).slice(0, limitCount);
};

export const addProduct = async (productData: Omit<Product, "id">): Promise<string> => {
  const docRef = doc(collection(db, COLLECTIONS.PRODUCTS));
  const newProduct = {
    ...productData,
    id: docRef.id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await setDoc(docRef, newProduct);
  return docRef.id;
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: Date.now(),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  await deleteDoc(docRef);
};

export const clearAllProducts = async (): Promise<number> => {
  const colRef = collection(db, COLLECTIONS.PRODUCTS);
  const snap = await getDocs(colRef);
  const promises = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(promises);
  return snap.size;
};

export const updateProductStock = async (
  id: string,
  stock: number,
  isAvailable?: boolean
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
  const updates: any = {
    stock: Math.max(0, stock),
    isAvailable: isAvailable !== undefined ? isAvailable : stock > 0,
    updatedAt: Date.now(),
  };
  await updateDoc(docRef, updates);
};
