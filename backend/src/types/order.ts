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
  // Distributor / Partner Retail POS Attribution
  orderType?: "direct" | "distributor_assisted";
  bookedByPartnerId?: string;
  bookedByPartnerName?: string;
  bookedByPartnerBusiness?: string;
  bookedByPartnerPhone?: string;
  shopName?: string;
  shopOwnerName?: string;
  shopPhone?: string;
  partnerCommissionRate?: number; // % at time of booking e.g. 10
  partnerCommissionAmount?: number; // calculated e.g. ₹450
  commissionStatus?: "Pending" | "Approved" | "Paid" | "Cancelled";
  distributorNotes?: string;
}
