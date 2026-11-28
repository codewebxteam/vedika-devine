import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Package, Truck, ArrowRight, Clock, LogIn } from "lucide-react-native";
import { getUserOrders, Order } from "@vedika/backend";
import { useAuth } from "../context/AuthContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { formatCurrency, formatDate } from "@vedika/backend";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { RootStackParamList } from "../navigation/types";

type OrdersNavProp = NativeStackNavigationProp<RootStackParamList>;

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<OrdersNavProp>();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const list = await getUserOrders(user.uid);
      setOrders(list);
    } catch (err) {
      console.warn("Failed to load user orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <LuxuryHeader title="Your Orders" subtitle="Order History" showBack={false} />
        <View style={styles.emptyContainer}>
          <Package size={48} color={colors.gold.primary} />
          <Text style={styles.emptyTitle}>Sign In to View Orders</Text>
          <Text style={styles.emptySubtitle}>
            Please sign in to track and view all your previous pooja samagri deliveries and receipts.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <LogIn size={16} color="#000" />
            <Text style={styles.loginButtonText}>Sign In with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trackGuestButton}
            onPress={() => navigation.navigate("TrackOrder")}
          >
            <Text style={styles.trackGuestText}>Have an Order Number? Track Here</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Your Orders"
        subtitle={`${orders.length} orders placed`}
        showBack={false}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.gold.primary} />
          <Text style={styles.loaderText}>Fetching your order history...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => item.id || item.orderNumber || String(index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gold.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Package size={48} color={colors.gold.primary} />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptySubtitle}>
                You haven't placed any orders yet. Discover our collection to begin.
              </Text>
              <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate("MainTabs", { screen: "ShopTab" } as any)}
              >
                <Text style={styles.shopNowText}>Explore Collection</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("TrackOrder", { orderNumber: item.orderNumber })
              }
            >
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
                  <View style={styles.dateRow}>
                    <Clock size={12} color={colors.text.muted} />
                    <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                  </View>
                </View>
                <OrderStatusBadge status={item.status} />
              </View>

              <View style={styles.divider} />

              {/* Order Items Preview */}
              <View style={styles.itemsSummary}>
                {item.items.slice(0, 2).map((it, idx) => (
                  <Text key={idx} style={styles.itemText} numberOfLines={1}>
                    • {it.quantity}x {it.name}
                  </Text>
                ))}
                {item.items.length > 2 && (
                  <Text style={styles.moreItemsText}>
                    +{item.items.length - 2} more items...
                  </Text>
                )}
              </View>

              <View style={styles.divider} />

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text>
                </View>

                <View style={styles.trackAction}>
                  <Truck size={14} color={colors.gold.primary} />
                  <Text style={styles.trackText}>Track Order</Text>
                  <ArrowRight size={14} color={colors.gold.primary} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },
  itemsSummary: {
    gap: 2,
  },
  itemText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  moreItemsText: {
    fontSize: 11,
    color: colors.gold.primary,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    color: colors.text.muted,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  trackAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  trackText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gold.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  loginButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  trackGuestButton: {
    paddingVertical: spacing.xs,
  },
  trackGuestText: {
    color: colors.gold.primary,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  shopNowButton: {
    backgroundColor: colors.gold.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  shopNowText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
});
