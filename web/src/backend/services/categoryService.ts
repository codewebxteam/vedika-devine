import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS, CATEGORIES as DEFAULT_CATEGORIES } from "../config/constants";
import { Category } from "../types/category";

// In-memory cache for fast sync and instant UI rendering
let categoriesCache: Category[] = [];

export const clearCategoriesCache = (): void => {
  categoriesCache = [];
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const colRef = collection(db, COLLECTIONS.CATEGORIES);
    const q = query(colRef);
    const snap = await getDocs(q);
    const list: Category[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as Category);
    });

    list.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
    categoriesCache = list;
    return list;
  } catch (error) {
    console.warn("Firestore categories error:", error);
    return categoriesCache;
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) || null;
};

export const addCategory = async (
  catData: Omit<Category, "id">
): Promise<string> => {
  const colRef = collection(db, COLLECTIONS.CATEGORIES);
  const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const docRef = doc(colRef, slug);
  const newCat: Category = {
    ...catData,
    id: slug,
    slug,
    displayOrder: catData.displayOrder || (categoriesCache.length + 1),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(docRef, newCat);
  categoriesCache = [...categoriesCache.filter((c) => c.id !== slug), newCat].sort(
    (a, b) => (a.displayOrder || 99) - (b.displayOrder || 99)
  );
  return slug;
};

export const updateCategory = async (
  id: string,
  catData: Partial<Category>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
  const updatedPayload = {
    ...catData,
    updatedAt: Date.now(),
  };
  await updateDoc(docRef, updatedPayload);
  categoriesCache = categoriesCache.map((c) =>
    c.id === id ? { ...c, ...updatedPayload } : c
  ).sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
};

export const deleteCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
  await deleteDoc(docRef);
  categoriesCache = categoriesCache.filter((c) => c.id !== id);
};

export const clearAllCategories = async (): Promise<number> => {
  const colRef = collection(db, COLLECTIONS.CATEGORIES);
  const snap = await getDocs(colRef);
  const promises = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(promises);
  categoriesCache = [];
  return snap.size;
};

export const seedDefaultCategories = async (): Promise<Category[]> => {
  try {
    const colRef = collection(db, COLLECTIONS.CATEGORIES);
    const promises = DEFAULT_CATEGORIES.map(async (cat, idx) => {
      const docRef = doc(colRef, cat.id);
      const catObj: Category = {
        ...cat,
        displayOrder: idx + 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(docRef, catObj, { merge: true });
      return catObj;
    });
    const seeded = await Promise.all(promises);
    categoriesCache = seeded;
    return seeded;
  } catch (err) {
    console.warn("Failed to seed default categories:", err);
    return DEFAULT_CATEGORIES.map((c, i) => ({
      ...c,
      displayOrder: i + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }));
  }
};
