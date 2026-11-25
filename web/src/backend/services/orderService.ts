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
import { SavedShop } from "../types/user";
import { SavedShop } from "../types/user";
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

export interface CreateDistributorAssistedOrderParams {
  distributorId: string;
  distributorName: string;
  distributorBusiness?: string;
  distributorPhone?: string;
  shopName: string;
  shopOwnerName: string;
  shopPhone: string;
  shopAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Order["items"];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: Order["paymentMethod"];
  commissionRate: number; // e.g. 10
  distributorNotes?: string;
}

export const createDistributorAssistedOrder = async (
  params: CreateDistributorAssistedOrderParams
): Promise<Order> => {
  const docRef = doc(collection(db, COLLECTIONS.ORDERS));
  const orderNumber = generateOrderNumber();
  const createdAt = Date.now();
  const status: OrderStatus = ORDER_STATUS.CONFIRMED;

  const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
  const estimatedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  // Calculate commission: (subtotal * commissionRate) / 100
  const partnerCommissionAmount = Math.round(
    (params.subtotal * (params.commissionRate || 10)) / 100
  );

  const fullOrder: Order = {
    id: docRef.id,
    orderNumber,
    userId: params.distributorId,
    userEmail: `shop.${params.shopPhone.replace(/[^0-9]/g, "")}@vedikadivine.retail`,
    items: params.items,
    subtotal: params.subtotal,
    shippingFee: params.shippingFee,
    discount: params.discount,
    total: params.total,
    shippingAddress: params.shopAddress,
    paymentMethod: params.paymentMethod,
    paymentStatus: params.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
    status,
    createdAt,
    estimatedDelivery,
    // Distributor Retail POS Attribution
    orderType: "distributor_assisted",
    bookedByPartnerId: params.distributorId,
    bookedByPartnerName: params.distributorName,
    bookedByPartnerBusiness: params.distributorBusiness || params.distributorName,
    bookedByPartnerPhone: params.distributorPhone,
    shopName: params.shopName,
    shopOwnerName: params.shopOwnerName,
    shopPhone: params.shopPhone,
    partnerCommissionRate: params.commissionRate || 10,
    partnerCommissionAmount,
    commissionStatus: "Pending",
    distributorNotes: params.distributorNotes,
  };

  await setDoc(docRef, fullOrder);

  // Automatically upsert shop to distributor's saved directory with last ordered items
  try {
    await upsertDistributorSavedShop({
      distributorId: params.distributorId,
      shopName: params.shopName,
      shopOwnerName: params.shopOwnerName,
      shopPhone: params.shopPhone,
      street: params.shopAddress.street,
      city: params.shopAddress.city,
      state: params.shopAddress.state,
      pincode: params.shopAddress.pincode,
      notes: params.distributorNotes,
      lastOrderId: docRef.id,
      lastOrderNumber: orderNumber,
      lastOrderDate: createdAt,
      lastOrderItems: params.items,
      orderTotal: params.total,
    });
  } catch (err) {
    console.warn("Auto-saving shop failed:", err);
  }

  return fullOrder;
};

export const upsertDistributorSavedShop = async (
  shopData: {
    distributorId: string;
    shopName: string;
    shopOwnerName: string;
    shopPhone: string;
    street: string;
    city: string;
    state?: string;
    pincode: string;
    notes?: string;
    lastOrderId?: string;
    lastOrderNumber?: string;
    lastOrderDate?: number;
    lastOrderItems?: any[];
    orderTotal?: number;
  }
): Promise<SavedShop> => {
  try {
    const shopsRef = collection(db, COLLECTIONS.DEALER_SHOPS);
    const q = query(
      shopsRef,
      where("distributorId", "==", shopData.distributorId)
    );
    const snap = await getDocs(q);

    let existingDocId: string | null = null;
    let existingData: SavedShop | null = null;

    const cleanInputPhone = shopData.shopPhone.replace(/[^0-9]/g, "");
    for (const d of snap.docs) {
      const data = d.data() as SavedShop;
      const cleanPhone = (data.shopPhone || "").replace(/[^0-9]/g, "");
      if (
        (cleanPhone && cleanPhone === cleanInputPhone) ||
        data.shopName.trim().toLowerCase() === shopData.shopName.trim().toLowerCase()
      ) {
        existingDocId = d.id;
        existingData = data;
        break;
      }
    }

    const now = Date.now();
    const targetDocRef = existingDocId
      ? doc(db, COLLECTIONS.DEALER_SHOPS, existingDocId)
      : doc(collection(db, COLLECTIONS.DEALER_SHOPS));

    const totalOrdersCount =
      (existingData?.totalOrdersCount || 0) + (shopData.orderTotal !== undefined ? 1 : 0);
    const totalSpent = (existingData?.totalSpent || 0) + (shopData.orderTotal || 0);

    const savedShop: SavedShop = {
      id: targetDocRef.id,
      distributorId: shopData.distributorId,
      shopName: shopData.shopName.trim(),
      shopOwnerName: shopOwnerNameClean(shopData.shopOwnerName),
      shopPhone: shopData.shopPhone.trim(),
      street: shopData.street.trim(),
      city: shopData.city.trim(),
      state: shopData.state || "Uttar Pradesh",
      pincode: shopData.pincode.trim(),
      notes: shopData.notes || existingData?.notes || "",
      totalOrdersCount,
      totalSpent,
      lastOrderId: shopData.lastOrderId || existingData?.lastOrderId,
      lastOrderNumber: shopData.lastOrderNumber || existingData?.lastOrderNumber,
      lastOrderDate: shopData.lastOrderDate || existingData?.lastOrderDate || now,
      lastOrderItems: shopData.lastOrderItems || existingData?.lastOrderItems || [],
      createdAt: existingData?.createdAt || now,
      updatedAt: now,
    };

    await setDoc(targetDocRef, savedShop, { merge: true });
    return savedShop;
  } catch (err) {
    console.warn("Could not save distributor shop:", err);
    throw err;
  }
};

const shopOwnerNameClean = (name?: string) => name?.trim() || "Shopkeeper";

export const getDistributorSavedShops = async (
  distributorId: string
): Promise<SavedShop[]> => {
  try {
    const shopsRef = collection(db, COLLECTIONS.DEALER_SHOPS);
    const q = query(shopsRef, where("distributorId", "==", distributorId));
    const snap = await getDocs(q);
    const list: SavedShop[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as SavedShop);
    });
    return list.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
  } catch (err) {
    console.warn("Error fetching distributor saved shops:", err);
    return [];
  }
};

export const deleteDistributorSavedShop = async (shopId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.DEALER_SHOPS, shopId);
  await deleteDoc(docRef);
};

export const getDistributorAssistedOrders = async (
  distributorId: string
): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const q = query(ordersRef, where("bookedByPartnerId", "==", distributorId));
    const querySnapshot = await getDocs(q);

    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });

    return orders.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
  } catch (error) {
    console.warn("Error fetching distributor assisted orders:", error);
    return [];
  }
};

export const updateOrderCommissionStatus = async (
  orderId: string,
  commissionStatus: "Pending" | "Approved" | "Paid" | "Cancelled"
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
  await updateDoc(docRef, { commissionStatus });
};
