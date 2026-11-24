import { APP_CONFIG } from "../config/constants";

export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return `${APP_CONFIG.CURRENCY}0`;
  return `${APP_CONFIG.CURRENCY}${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const formatDate = (timestamp: string | number | undefined): string => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VD-${timestamp}-${random}`;
};
