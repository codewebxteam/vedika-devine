import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Store,
  MapPin,
  Phone,
  RotateCcw,
  PlusCircle,
  MessageCircle,
  Trash2,
  Search,
  Package,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getDistributorSavedShops,
  deleteDistributorSavedShop,
  SavedShop,
  formatCurrency,
  formatDate,
} from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../../theme/colors";
import { LuxuryHeader } from "../../components/LuxuryHeader";
import { RootStackParamList } from "../../navigation/types";

type ShopsNavProp = NativeStackNavigationProp<RootStackParamList>;

export const DealerShopsScreen: React.FC = () => {
  const navigation = useNavigation<ShopsNavProp>();
  const { user } = useAuth();

  const [shops, setShops] = useState<SavedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const distributorId = user?.uid || "";

  const fetchShops = async () => {
    if (!distributorId) {
      setLoading(false);
      return;
    }
    try {
      const list = await getDistributorSavedShops(distributorId);
      setShops(list);
    } catch (err) {
      console.warn("Failed to load distributor shops:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [distributorId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShops();
  };

  const handleDeleteShop = (shop: SavedShop) => {
    Alert.alert(
      "Delete Shop Record",
      `Are you sure you want to remove ${shop.shopName} from your retail directory?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDistributorSavedShop(shop.id);
              setShops((prev) => prev.filter((s) => s.id !== shop.id));
            } catch (err) {
              Alert.alert("Error", "Failed to remove shop.");
            }
          },
        },
      ]
    );
  };

  const handleWhatsAppDukandar = (shop: SavedShop) => {
    const cleanPhone = shop.shopPhone.replace(/[^0-9]/g, "");
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Namaste ${shop.shopOwnerName} Ji,\nThis is regarding Vedika Divine Pooja Samagri inventory at ${shop.shopName}. Do you need a stock refill?`
    );
    Linking.openURL(`https://wa.me/${targetPhone}?text=${text}`);
  };

  const filteredShops = shops.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.shopName.toLowerCase().includes(q) ||
      s.shopOwnerName.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.shopPhone.includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="My Retail Shops"
        subtitle="मेरी दुकानें • 1-Click Repeat Orders"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Top Search Bar & Add Shop CTA */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <Search size={16} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dukan by name, owner, city..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={styles.addDukanBtn}
          onPress={() => navigation.navigate("DealerPOS", { initialShop: undefined })}
        >
          <PlusCircle size={16} color="#000" />
          <Text style={styles.addDukanText}>New Dukan</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.gold.primary} />
          <Text style={styles.loaderText}>Loading retail shops network...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredShops}
          keyExtractor={(item) => item.id}
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
              <Store size={48} color={colors.gold.primary} />
              <Text style={styles.emptyTitle}>No Saved Retail Shops Found</Text>
              <Text style={styles.emptySubtitle}>
                Shops you book orders for are automatically saved here for instant 1-click repeat orders.
              </Text>
              <TouchableOpacity
                style={styles.firstOrderBtn}
                onPress={() => navigation.navigate("DealerPOS")}
              >
                <Text style={styles.firstOrderText}>Book First Shop Order</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.shopCard}>
              {/* Header */}
              <View style={styles.shopHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.shopName}>{item.shopName}</Text>
                  <View style={styles.ownerRow}>
                    <Text style={styles.ownerName}>{item.shopOwnerName}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.phoneText}>{item.shopPhone}</Text>
                  </View>
                </View>

                <View style={styles.cityBadge}>
                  <Text style={styles.cityBadgeText}>{item.city}</Text>
                </View>
              </View>

              {/* Address */}
              <View style={styles.addressRow}>
                <MapPin size={14} color={colors.text.muted} />
                <Text style={styles.addressText} numberOfLines={2}>
                  {item.street}, {item.city}, {item.pincode}
                </Text>
              </View>

              {/* Stats Bar */}
              <View style={styles.statsBar}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Orders Booked</Text>
                  <Text style={styles.statValue}>{item.totalOrdersCount || 0}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Lifetime Spent</Text>
                  <Text style={styles.statValue}>{formatCurrency(item.totalSpent || 0)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Last Ordered</Text>
                  <Text style={styles.statValue}>
                    {item.lastOrderDate ? formatDate(item.lastOrderDate) : "Recently"}
                  </Text>
                </View>
              </View>

              {/* Last order preview if available */}
              {item.lastOrderNumber && (
                <View style={styles.lastOrderRow}>
                  <Package size={12} color={colors.gold.primary} />
                  <Text style={styles.lastOrderText}>
                    Last: #{item.lastOrderNumber} ({item.lastOrderItems?.length || 0} items)
                  </Text>
                </View>
              )}

              {/* Action Buttons Row */}
              <View style={styles.actionsRow}>
                {/* 1-Click Repeat Last Order */}
                <TouchableOpacity
                  style={styles.repeatBtn}
                  onPress={() => navigation.navigate("DealerPOS", { initialShop: item })}
                >
                  <RotateCcw size={14} color="#000" />
                  <Text style={styles.repeatBtnText}>Repeat Order</Text>
                </TouchableOpacity>

                {/* WhatsApp Dukandar */}
                <TouchableOpacity
                  style={styles.whatsAppBtn}
                  onPress={() => handleWhatsAppDukandar(item)}
                >
                  <MessageCircle size={14} color="#25D366" />
                  <Text style={styles.whatsAppBtnText}>WhatsApp</Text>
                </TouchableOpacity>

                {/* Delete */}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteShop(item)}
                >
                  <Trash2 size={16} color={colors.text.muted} />
                </TouchableOpacity>
              </View>
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
  topBar: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    paddingHorizontal: spacing.sm,
    height: 42,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 13,
  },
  addDukanBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.primary,
    paddingHorizontal: spacing.sm,
    height: 42,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  addDukanText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
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
  shopCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.xs,
  },
  shopName: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ownerName: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dot: {
    color: colors.text.muted,
  },
  phoneText: {
    fontSize: 12,
    color: colors.gold.primary,
  },
  cityBadge: {
    backgroundColor: colors.gold.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  cityBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 4,
  },
  addressText: {
    fontSize: 11,
    color: colors.text.muted,
    flex: 1,
  },
  statsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background.secondary,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginVertical: spacing.xs,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 9,
    color: colors.text.muted,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border.subtle,
  },
  lastOrderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: spacing.xs,
  },
  lastOrderText: {
    fontSize: 11,
    color: colors.gold.primary,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: 4,
  },
  repeatBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: 7,
    gap: 4,
  },
  repeatBtnText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  whatsAppBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(37, 211, 102, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(37, 211, 102, 0.4)",
    borderRadius: borderRadius.sm,
    paddingVertical: 7,
    paddingHorizontal: 12,
    gap: 4,
  },
  whatsAppBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#25D366",
  },
  deleteBtn: {
    padding: 7,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
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
    textAlign: "center",
    lineHeight: 18,
    marginBottom: spacing.lg,
  },
  firstOrderBtn: {
    backgroundColor: colors.gold.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  firstOrderText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#000",
  },
});
