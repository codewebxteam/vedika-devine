import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  HomeTab: undefined;
  ShopTab: { categorySlug?: string } | undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  ProductDetail: { productId: string; productTitle?: string };
  Checkout: undefined;
  OrderSuccess: {
    orderNumber: string;
    total: number;
    paymentMethod: string;
    shopPhone?: string;
    shopName?: string;
    orderId?: string;
  };
  TrackOrder: { orderNumber?: string } | undefined;
  Wishlist: undefined;
  Login: undefined;
  Register: undefined;
  Contact: undefined;
  Wholesale: undefined;

  // Distributor / Dealer Portal
  DealerDashboard: undefined;
  DealerPOS: { initialShop?: any } | undefined;
  DealerShops: undefined;
  DealerCommission: undefined;
};
