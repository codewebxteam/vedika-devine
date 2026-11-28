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
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getDistributorAssistedOrders,
  Order,
  formatCurrency,
  formatDate,
} from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../../theme/colors";
import { LuxuryHeader } from "../../components/LuxuryHeader";
import { RootStackParamList } from "../../navigation/types";

type CommNavProp = NativeStackNavigationProp<RootStackParamList>;

export const DealerCommissionScreen: React.FC = () => {
  const navigation = useNavigation<CommNavProp>();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const distributorId = user?.uid || "";

  const fetchLedger = async () => {
    if (!distributorId) {
      setLoading(false);
      return;
    }
    try {
      const list = await getDistributorAssistedOrders(distributorId);
      setOrders(list);
    } catch (err) {
      console.warn("Failed to load distributor ledger:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [distributorId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLedger();
  };

  // Aggregated Stats
  const totalEarned = orders.reduce(
    (acc, o) => acc + (o.partnerCommissionAmount || 0),
    0
  );
  const totalPaid = orders
    .filter((o) => o.commissionStatus === "Paid")
    .reduce((acc, o) => acc + (o.partnerCommissionAmount || 0), 0);
  const totalPending = orders
    .filter((o) => o.commissionStatus !== "Paid" && o.commissionStatus !== "Cancelled")
    .reduce((acc, o) => acc + (o.partnerCommissionAmount || 0), 0);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "all") return true;
    return (o.commissionStatus || "Pending").toLowerCase() === statusFilter.toLowerCase();
  });

  const renderStatusPill = (status?: string) => {
    const s = status || "Pending";
    if (s === "Paid") {
      return (
        <View style={[styles.statusPill, { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: colors.status.success }]}>
          <Text style={[styles.statusText, { color: colors.status.success }]}>Paid to Bank</Text>
        </View>
      );
    }
    if (s === "Approved") {
      return (
        <View style={[styles.statusPill, { backgroundColor: "rgba(245, 158, 11, 0.15)", borderColor: colors.gold.primary }]}>
          <Text style={[styles.statusText, { color: colors.gold.primary }]}>Approved for Payout</Text>
        </View>
      );
    }
    return (
      <View style={[styles.statusPill, { backgroundColor: "rgba(156, 163, 175, 0.15)", borderColor: colors.text.muted }]}>
        <Text style={[styles.statusText, { color: colors.text.secondary }]}>Pending Clearance</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Commission Ledger"
        subtitle="10% Distributor Earnings & Admin Payouts"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Overview Cards */}
      <View style={styles.overviewRow}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>TOTAL EARNED</Text>
          <Text style={styles.overviewValue}>{formatCurrency(totalEarned)}</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>PAID BY ADMIN</Text>
          <Text style={[styles.overviewValue, { color: colors.status.success }]}>
            {formatCurrency(totalPaid)}
          </Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>PENDING</Text>
          <Text style={[styles.overviewValue, { color: colors.status.warning }]}>
            {formatCurrency(totalPending)}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {["all", "Pending", "Approved", "Paid"].map((st) => (
          <TouchableOpacity
            key={st}
            style={[
              styles.filterTab,
              statusFilter === st && styles.filterTabActive,
            ]}
            onPress={() => setStatusFilter(st)}
          >
            <Text
              style={[
                styles.filterTabText,
                statusFilter === st && styles.filterTabTextActive,
              ]}
            >
              {st === "all" ? "All Orders" : st}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.gold.primary} />
          <Text style={styles.loaderText}>Loading ledger records...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
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
              <Text style={styles.emptyTitle}>No Commission Records</Text>
              <Text style={styles.emptySubtitle}>
                No orders matching the selected payout status filter.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.shopName}>{item.shopName || "Retail Shop"}</Text>
                  <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
                </View>
                {renderStatusPill(item.commissionStatus)}
              </View>

              <View style={styles.divider} />

              <View style={styles.statsRow}>
                <View>
                  <Text style={styles.statLabel}>Order Date</Text>
                  <Text style={styles.statValue}>{formatDate(item.createdAt)}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>Order Amount</Text>
                  <Text style={styles.statValue}>{formatCurrency(item.total)}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.statLabel}>10% Commission</Text>
                  <Text style={styles.commissionValue}>
                    + {formatCurrency(item.partnerCommissionAmount || 0)}
                  </Text>
                </View>
              </View>

              {item.distributorNotes ? (
                <View style={styles.notesRow}>
                  <Text style={styles.notesText}>Notes: {item.distributorNotes}</Text>
                </View>
              ) : null}
            </View>
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
  overviewRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
    alignItems: "center",
  },
  overviewLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.text.muted,
    marginBottom: 2,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  filterTabActive: {
    backgroundColor: colors.gold.surface,
    borderColor: colors.gold.primary,
  },
  filterTabText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  filterTabTextActive: {
    color: colors.gold.primary,
    fontWeight: "bold",
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
    alignItems: "flex-start",
  },
  shopName: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  orderNumber: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 1,
  },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 10,
    color: colors.text.muted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
  commissionValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  notesRow: {
    marginTop: spacing.xs,
    backgroundColor: colors.background.secondary,
    padding: 6,
    borderRadius: borderRadius.xs,
  },
  notesText: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
