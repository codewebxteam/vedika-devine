import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS, ORDER_STATUS } from "../config/constants";
import { Order, OrderStatus } from "../types/order";
import { generateOrderNumber } from "../utils/formatters";

export const createOrder = async (
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">
): Promise<Order> => {
  const docRef = doc(collection(db, COLLECTIONS.ORDERS));
  const orderNumber = generateOrderNumber();
  const createdAt = Date.now();
  const status: OrderStatus = ORDER_STATUS.CONFIRMED;

  // Calculate estimated delivery: 3 to 5 business days
  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const fullOrder: Order = {
    ...orderData,
    id: docRef.id,
    orderNumber,
    status,
    createdAt,
    estimatedDelivery,
  };

  await setDoc(docRef, fullOrder);
  return fullOrder;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const q = query(ordersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });

    return orders.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  } catch (error) {
    console.warn("Error fetching user orders:", error);
    return [];
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const querySnapshot = await getDocs(ordersRef);

    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });

    return orders.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  } catch (error) {
    console.warn("Error fetching all orders for admin:", error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
  } catch (error) {
    console.warn("Error fetching order by ID:", error);
  }
  return null;
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
  const updates: Record<string, any> = { status };
  if (status === "Shipped") {
    updates.dispatchedAt = Date.now();
  } else if (status === "Delivered") {
    updates.deliveredAt = Date.now();
  } else if (status === "Cancelled") {
    updates.cancelledAt = Date.now();
  }
  await updateDoc(docRef, updates);
};

export const updateOrderTracking = async (
  orderId: string,
  data: {
    courierPartner?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    dispatchNotes?: string;
    status?: OrderStatus;
    estimatedDelivery?: string;
  }
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
  const updates: Record<string, any> = {};

  if (data.courierPartner !== undefined) updates.courierPartner = data.courierPartner;
  if (data.trackingNumber !== undefined) updates.trackingNumber = data.trackingNumber;
  if (data.trackingUrl !== undefined) updates.trackingUrl = data.trackingUrl;
  if (data.dispatchNotes !== undefined) updates.dispatchNotes = data.dispatchNotes;
  if (data.estimatedDelivery !== undefined) updates.estimatedDelivery = data.estimatedDelivery;

  if (data.status) {
    updates.status = data.status;
    if (data.status === "Shipped") updates.dispatchedAt = Date.now();
    if (data.status === "Delivered") updates.deliveredAt = Date.now();
    if (data.status === "Cancelled") updates.cancelledAt = Date.now();
  }

  await updateDoc(docRef, updates);
};

export const cancelUserOrder = async (
  orderId: string,
  reason = "Cancelled by user"
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
  await updateDoc(docRef, {
    status: "Cancelled" as OrderStatus,
    cancelledAt: Date.now(),
    cancelReason: reason,
  });
};

export const trackOrderByOrderNumber = async (
  orderNumber: string,
  contact?: string
): Promise<Order | null> => {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const cleanNumber = orderNumber.trim().toUpperCase();

    // Try finding by orderNumber
    const q = query(ordersRef, where("orderNumber", "==", cleanNumber));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const data = { id: docSnap.id, ...docSnap.data() } as Order;

      // If contact provided, verify it matches email or phone
      if (contact && contact.trim()) {
        const c = contact.trim().toLowerCase();
        const matchesEmail = data.userEmail?.toLowerCase() === c;
        const matchesPhone = data.shippingAddress?.phone?.includes(c);
        if (!matchesEmail && !matchesPhone) {
          return null; // verification failed
        }
      }
      return data;
    }

    // Try finding by doc ID as fallback
    const docRef = doc(db, COLLECTIONS.ORDERS, orderNumber.trim());
    const singleSnap = await getDoc(docRef);
    if (singleSnap.exists()) {
      const data = { id: singleSnap.id, ...singleSnap.data() } as Order;
      if (contact && contact.trim()) {
        const c = contact.trim().toLowerCase();
        const matchesEmail = data.userEmail?.toLowerCase() === c;
        const matchesPhone = data.shippingAddress?.phone?.includes(c);
        if (!matchesEmail && !matchesPhone) return null;
      }
      return data;
    }
  } catch (err) {
    console.warn("Could not find order by tracking number:", err);
  }
  return null;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
  await deleteDoc(docRef);
};
