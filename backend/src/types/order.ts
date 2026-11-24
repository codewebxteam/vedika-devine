import { Address } from "./user";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod =
  | "Cash on Delivery"
  | "UPI / Online Payment"
  | "Credit / Debit Card"
  | "Net Banking";

export interface OrderTrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp?: number;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: "Pending" | "Paid" | "Failed";
  status: OrderStatus;
  createdAt: string | number;
  estimatedDelivery?: string;
  // Tracking & Fulfillment Enhancements
  courierPartner?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  dispatchedAt?: number;
  deliveredAt?: number;
  cancelledAt?: number;
  cancelReason?: string;
  dispatchNotes?: string;
}
