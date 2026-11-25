export type UserRole = "customer" | "admin" | "dealer" | "dealer_pending";

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface DealerInfo {
  businessName: string;
  contactPerson: string;
  phone: string;
  city: string;
  state?: string;
  gstNumber?: string;
  estimatedMonthlyVolume?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: number;
  approvedAt?: number;
  notes?: string;
  // Commission & Territory Settings (Configured by Admin)
  commissionRate?: number; // e.g. 10 for 10%
  assignedTerritory?: string; // e.g. "Kushinagar & Deoria Region"
  totalCommissionEarned?: number;
  totalCommissionPaid?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string | null;
  photoURL?: string | null;
  addresses?: Address[];
  role?: UserRole;
  dealerInfo?: DealerInfo;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface SavedShop {
  id: string;
  distributorId: string;
  shopName: string;
  shopOwnerName: string;
  shopPhone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  totalOrdersCount: number;
  totalSpent: number;
  lastOrderId?: string;
  lastOrderNumber?: string;
  lastOrderDate?: number;
  lastOrderItems?: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  createdAt: number;
  updatedAt: number;
}
