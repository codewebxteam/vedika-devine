import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../config/constants";

export interface WholesaleInquiry {
  id?: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  city: string;
  estimatedQuantity: string;
  candleTypesNeeded: string[];
  message?: string;
  createdAt: number;
}

export const submitWholesaleInquiry = async (
  inquiry: Omit<WholesaleInquiry, "id" | "createdAt">
): Promise<string> => {
  try {
    const docRef = doc(collection(db, COLLECTIONS.INQUIRIES));
    const fullData: WholesaleInquiry = {
      ...inquiry,
      id: docRef.id,
      createdAt: Date.now(),
    };
    await setDoc(docRef, fullData);
    return docRef.id;
  } catch (error) {
    console.warn("Could not save wholesale inquiry to Firestore:", error);
    return `inq-${Date.now()}`;
  }
};

export const getAllInquiries = async (): Promise<WholesaleInquiry[]> => {
  try {
    const inquiriesRef = collection(db, COLLECTIONS.INQUIRIES);
    const snapshot = await getDocs(inquiriesRef);
    const inquiries: WholesaleInquiry[] = [];
    snapshot.forEach((snap) => {
      inquiries.push({ id: snap.id, ...snap.data() } as WholesaleInquiry);
    });
    return inquiries.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  } catch (error) {
    console.warn("Error fetching inquiries for admin:", error);
    return [];
  }
};

export const deleteInquiry = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.INQUIRIES, id);
  await deleteDoc(docRef);
};
