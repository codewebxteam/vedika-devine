import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Briefcase,
  Store,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getDistributorAssistedOrders,
  getDistributorSavedShops,
  Order,
  SavedShop,
  formatCurrency,
  formatDate,
} from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../../theme/colors";
import { LuxuryHeader } from "../../components/LuxuryHeader";
import { GoldButton } from "../../components/GoldButton";
import { RootStackParamList } from "../../navigation/types";

type DealerNavProp = NativeStackNavigationProp<RootStackParamList>;

export const DealerDashboardScreen: React.FC = () => {
  const navigation = useNavigation<DealerNavProp>();
  const { user, profile, isDealer, isAdmin } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [shops, setShops] = useState<SavedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const distributorId = user?.uid || "";

  const loadDealerData = async () => {
    if (!distributorId) {
      setLoading(false);
      return;
    }
    try {
      const [fetchedOrders, fetchedShops] = await Promise.all([
        getDistributorAssistedOrders(distributorId),
        getDistributorSavedShops(distributorId),
      ]);
      setOrders(fetchedOrders);
      setShops(fetchedShops);
    } catch (err) {
      console.warn("Failed to load distributor data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDealerData();
  }, [distributorId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDealerData();
  };

  // Commission & Turnover Calculations
  const totalTurnover = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCommissionEarned = orders.reduce(
    (sum, o) => sum + (o.partnerCommissionAmount || 0),
    0
  );
  const commissionPaidByAdmin = orders
    .filter((o) => o.commissionStatus === "Paid")
    .reduce((sum, o) => sum + (o.partnerCommissionAmount || 0), 0);
  const commissionPending = orders
    .filter((o) => o.commissionStatus !== "Paid" && o.commissionStatus !== "Cancelled")
    .reduce((sum, o) => sum + (o.partnerCommissionAmount || 0), 0);

  if (!isDealer && !isAdmin) {
    return (
      <View style={styles.container}>
        <LuxuryHeader
          title="Distributor Access"
          subtitle="Authorized Partners Only"
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.unauthorizedContainer}>
          <ShieldAlert size={48} color={colors.status.warning} />
          <Text style={styles.unauthorizedTitle}>Access Restricted</Text>
          <Text style={styles.unauthorizedText}>
            This portal is exclusively reserved for authorized Vedika Divine Distributors & Field Agents.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Return to Sanctuary</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Distributor Console"
        subtitle={(profile as any)?.businessName || profile?.displayName || "Field Partner"}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.gold.primary} />
          <Text style={styles.loaderText}>Loading distributor ledger...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.gold.primary}
            />
          }
        >
          {/* Quick Booking CTA Banner */}
          <TouchableOpacity
            style={styles.posBanner}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("DealerPOS")}
          >
            <View style={styles.posBannerLeft}>
              <Store size={26} color="#000" />
              <View>
                <Text style={styles.posBannerTitle}>Book New Shop Order (Field POS)</Text>
                <Text style={styles.posBannerSub}>
                  Select saved shop or enter address • 10% instant commission
                </Text>
              </View>
            </View>
            <ArrowRight size={20} color="#000" />
          </TouchableOpacity>

          {/* KPI Dashboard Cards */}
          <View style={styles.kpiGrid}>
            {/* Total Turnover */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <TrendingUp size={16} color={colors.gold.primary} />
                <Text style={styles.kpiLabel}>FIELD TURNOVER</Text>
              </View>
              <Text style={styles.kpiValue}>{formatCurrency(totalTurnover)}</Text>
              <Text style={styles.kpiSub}>{orders.length} orders booked</Text>
            </View>

            {/* Total Commission */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <DollarSign size={16} color={colors.gold.primary} />
                <Text style={styles.kpiLabel}>TOTAL 10% EARNED</Text>
              </View>
              <Text style={[styles.kpiValue, { color: colors.gold.primary }]}>
                {formatCurrency(totalCommissionEarned)}
              </Text>
              <Text style={styles.kpiSub}>10% on every booked carton</Text>
            </View>

            {/* Paid by Admin */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <CheckCircle size={16} color={colors.status.success} />
                <Text style={styles.kpiLabel}>PAID BY ADMIN</Text>
              </View>
              <Text style={[styles.kpiValue, { color: colors.status.success }]}>
                {formatCurrency(commissionPaidByAdmin)}
              </Text>
              <Text style={styles.kpiSub}>Transferred to bank</Text>
            </View>

            {/* Pending Payout */}
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Clock size={16} color={colors.status.warning} />
                <Text style={styles.kpiLabel}>PENDING BALANCE</Text>
              </View>
              <Text style={[styles.kpiValue, { color: colors.status.warning }]}>
                {formatCurrency(commissionPending)}
              </Text>
              <Text style={styles.kpiSub}>Awaiting next admin payout</Text>
            </View>
          </View>

          {/* Quick Navigation Cards */}
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate("DealerShops")}
            >
              <Store size={20} color={colors.gold.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.navCardTitle}>My Retail Shops ({shops.length})</Text>
                <Text style={styles.navCardSub}>1-Click Repeat Orders & Dukan Directory</Text>
              </View>
              <ArrowRight size={16} color={colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => navigation.navigate("DealerCommission")}
            >
              <DollarSign size={20} color={colors.gold.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.navCardTitle}>Commission Ledger</Text>
                <Text style={styles.navCardSub}>Itemized status per order & payouts</Text>
              </View>
              <ArrowRight size={16} color={colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Recent Orders List */}
          <View style={styles.recentOrdersSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderTitle}>RECENT FIELD ORDERS</Text>
              <TouchableOpacity onPress={() => navigation.navigate("DealerCommission")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {orders.length === 0 ? (
              <View style={styles.emptyOrdersCard}>
                <Text style={styles.emptyOrdersTitle}>No Orders Booked Yet</Text>
                <Text style={styles.emptyOrdersSub}>
                  Visit retail dukans and book their first order to earn 10% commission.
                </Text>
              </View>
            ) : (
              orders.slice(0, 5).map((ord) => (
                <View key={ord.id} style={styles.orderItem}>
                  <View style={styles.orderTopRow}>
                    <View>
                      <Text style={styles.orderShopName}>
                        {ord.shopName || "Retail Shop"}
                      </Text>
                      <Text style={styles.orderNumberSub}>#{ord.orderNumber}</Text>
                    </View>
                    <View style={styles.commissionPill}>
                      <Text style={styles.commissionPillText}>
                        + {formatCurrency(ord.partnerCommissionAmount || 0)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.orderBottomRow}>
                    <Text style={styles.orderDate}>{formatDate(ord.createdAt)}</Text>
                    <Text style={styles.orderTotal}>Total: {formatCurrency(ord.total)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  unauthorizedTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  unauthorizedText: {
    fontSize: 13,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.gold.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  backButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  posBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.gold.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  posBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  posBannerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  posBannerSub: {
    fontSize: 11,
    color: "#1c1917",
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.xs,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.muted,
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 2,
  },
  kpiSub: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  navRow: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  navCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    gap: spacing.sm,
  },
  navCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  navCardSub: {
    fontSize: 11,
    color: colors.text.muted,
  },
  recentOrdersSection: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold.primary,
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.gold.primary,
  },
  emptyOrdersCard: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  emptyOrdersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  emptyOrdersSub: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
  },
  orderItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderShopName: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  orderNumberSub: {
    fontSize: 11,
    color: colors.text.muted,
  },
  commissionPill: {
    backgroundColor: "rgba(217, 119, 6, 0.15)",
    borderWidth: 1,
    borderColor: colors.border.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  commissionPillText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  orderBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDate: {
    fontSize: 11,
    color: colors.text.muted,
  },
  orderTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
