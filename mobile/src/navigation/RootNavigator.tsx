import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { BottomTabNavigator } from "./BottomTabNavigator";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import { OrderSuccessScreen } from "../screens/OrderSuccessScreen";
import { TrackOrderScreen } from "../screens/TrackOrderScreen";
import { WishlistScreen } from "../screens/WishlistScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ContactScreen } from "../screens/ContactScreen";
import { WholesaleScreen } from "../screens/WholesaleScreen";

// Dealer Field POS Screens
import { DealerDashboardScreen } from "../screens/dealer/DealerDashboardScreen";
import { DealerPOSScreen } from "../screens/dealer/DealerPOSScreen";
import { DealerShopsScreen } from "../screens/dealer/DealerShopsScreen";
import { DealerCommissionScreen } from "../screens/dealer/DealerCommissionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#0C0A09" },
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Wholesale" component={WholesaleScreen} />

      {/* Distributor / Dealer Portal Stack */}
      <Stack.Screen name="DealerDashboard" component={DealerDashboardScreen} />
      <Stack.Screen name="DealerPOS" component={DealerPOSScreen} />
      <Stack.Screen name="DealerShops" component={DealerShopsScreen} />
      <Stack.Screen name="DealerCommission" component={DealerCommissionScreen} />
    </Stack.Navigator>
  );
};
