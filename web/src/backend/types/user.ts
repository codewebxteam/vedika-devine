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
