import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Store,
  MapPin,
  Package,
  Plus,
  Minus,
  CheckCircle2,
  Lock,
  ChevronDown,
  Sparkles,
} from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import {
  getProducts,
  getDistributorSavedShops,
  createDistributorAssistedOrder,
  Product,
  SavedShop,
  formatCurrency,
} from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../../theme/colors";
import { LuxuryHeader } from "../../components/LuxuryHeader";
import { GoldButton } from "../../components/GoldButton";
import { RootStackParamList } from "../../navigation/types";

type POSRouteProp = RouteProp<RootStackParamList, "DealerPOS">;
type POSNavProp = NativeStackNavigationProp<RootStackParamList>;

export const DealerPOSScreen: React.FC = () => {
  const route = useRoute<POSRouteProp>();
  const navigation = useNavigation<POSNavProp>();
  const { user, profile } = useAuth();

  const [savedShops, setSavedShops] = useState<SavedShop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Shop details form state
  const [selectedShopId, setSelectedShopId] = useState<string>("new");
  const [shopName, setShopName] = useState("");
  const [shopOwnerName, setShopOwnerName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");

  // Order items state: map of productId -> quantity
  const [selectedQuantities, setSelectedQuantities] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    const initPOS = async () => {
      try {
        const [fetchedProducts, fetchedShops] = await Promise.all([
          getProducts(),
          user ? getDistributorSavedShops(user.uid) : Promise.resolve([]),
        ]);
        setProducts(fetchedProducts);
        setSavedShops(fetchedShops);

        // Preload shop if passed via route navigation
        if (route.params?.initialShop) {
          applyShop(route.params.initialShop);
        }
      } catch (err) {
        console.warn("Error initializing POS:", err);
      } finally {
        setLoading(false);
      }
    };
    initPOS();
  }, [user, route.params?.initialShop]);

  const applyShop = (shop: SavedShop) => {
    setSelectedShopId(shop.id);
    setShopName(shop.shopName);
    setShopOwnerName(shop.shopOwnerName);
    setShopPhone(shop.shopPhone);
    setStreet(shop.street);
    setCity(shop.city);
    setStateName(shop.state || "Uttar Pradesh");
    setPincode(shop.pincode);
    setNotes(shop.notes || "");

    // If shop had last ordered items, prefill them!
    if (shop.lastOrderItems && Array.isArray(shop.lastOrderItems)) {
      const qtyMap: { [id: string]: number } = {};
      shop.lastOrderItems.forEach((it: any) => {
        if (it.productId) {
          qtyMap[it.productId] = it.quantity || 1;
        }
      });
      setSelectedQuantities(qtyMap);
    }
  };

  const handleSelectShopDropdown = (shopId: string) => {
    if (shopId === "new") {
      setSelectedShopId("new");
      setShopName("");
      setShopOwnerName("");
      setShopPhone("");
      setStreet("");
      setCity("");
      setPincode("");
      setNotes("");
    } else {
      const match = savedShops.find((s) => s.id === shopId);
      if (match) applyShop(match);
    }
  };

  const updateProductQty = (productId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[productId];
      } else {
        copy[productId] = next;
      }
      return copy;
    });
  };

  // Calculations
  const orderedItems = products
    .filter((p) => selectedQuantities[p.id] && selectedQuantities[p.id] > 0)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      price: p.price,
      quantity: selectedQuantities[p.id],
      image: p.images?.[0] || "",
    }));

  const subtotal = orderedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const shippingFee = 0; // Free transport delivery for field distributor orders
  const total = subtotal + shippingFee;
  const commissionEarned = Math.round(total * 0.1); // 10% commission

  const handleBookOrder = async () => {
    if (!shopName.trim()) {
      Alert.alert("Missing Detail", "Please enter retail Shop Name (दुकान का नाम).");
      return;
    }
    if (!shopOwnerName.trim()) {
      Alert.alert("Missing Detail", "Please enter Shopkeeper Name (दुकानदार का नाम).");
      return;
    }
    if (!shopPhone.trim() || shopPhone.replace(/[^0-9]/g, "").length < 10) {
      Alert.alert("Missing Detail", "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!street.trim()) {
      Alert.alert("Missing Detail", "Please enter dukan street address/locality.");
      return;
    }
    if (!city.trim() || !pincode.trim()) {
      Alert.alert("Missing Detail", "Please provide dukan city and 6-digit pincode.");
      return;
    }
    if (orderedItems.length === 0) {
      Alert.alert("Empty Order", "Please select at least 1 product or carton.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createDistributorAssistedOrder({
        distributorId: user?.uid || "distributor_unknown",
        distributorName: profile?.displayName || "Distributor Partner",
        distributorBusiness: (profile as any)?.businessName || profile?.displayName || "Field Agency",
        distributorPhone: profile?.phoneNumber || "8874205655",
        shopName: shopName.trim(),
        shopOwnerName: shopOwnerName.trim(),
        shopPhone: shopPhone.trim(),
        shopAddress: {
          fullName: shopOwnerName.trim(),
          phone: shopPhone.trim(),
          street: street.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
        items: orderedItems,
        subtotal,
        shippingFee: 0,
        discount: 0,
        total,
        paymentMethod: "Cash on Delivery",
        distributorNotes: notes.trim(),
        commissionRate: 10,
      });

      navigation.replace("OrderSuccess", {
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        shopPhone: shopPhone.trim(),
        shopName: shopName.trim(),
        orderId: order.id,
      });
    } catch (err: any) {
      console.warn("Failed to book distributor order:", err);
      Alert.alert("Booking Error", err.message || "Failed to book field order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.gold.primary} />
        <Text style={styles.loaderText}>Loading Field POS Engine...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Field POS Engine"
        subtitle="10% Commission Retail Booking"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Section 1: Dukan Address & Saved Shop Selector */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Store size={18} color={colors.gold.primary} />
            <Text style={styles.sectionTitle}>1. RETAIL SHOP DESTINATION (दुकान विवरण)</Text>
          </View>
          <Text style={styles.sectionSub}>
            Admin will dispatch the cartons directly to this retail shop address.
          </Text>

          {/* Saved Shop Selector Pills */}
          {savedShops.length > 0 && (
            <View style={styles.savedShopsSelector}>
              <Text style={styles.selectorLabel}>SELECT PREVIOUSLY SAVED DUKAN:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopsScroll}>
                <TouchableOpacity
                  style={[
                    styles.shopChip,
                    selectedShopId === "new" && styles.shopChipActive,
                  ]}
                  onPress={() => handleSelectShopDropdown("new")}
                >
                  <Text
                    style={[
                      styles.shopChipText,
                      selectedShopId === "new" && styles.shopChipTextActive,
                    ]}
                  >
                    + Enter New Shop
                  </Text>
                </TouchableOpacity>

                {savedShops.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.shopChip,
                      selectedShopId === s.id && styles.shopChipActive,
                    ]}
                    onPress={() => handleSelectShopDropdown(s.id)}
                  >
                    <Text
                      style={[
                        styles.shopChipText,
                        selectedShopId === s.id && styles.shopChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {s.shopName} ({s.city})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Shop Name (दुकान का नाम) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Radhey Shyam Gift Corner"
              placeholderTextColor={colors.text.muted}
              value={shopName}
              onChangeText={setShopName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Shop Owner (दुकानदार) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor={colors.text.muted}
                value={shopOwnerName}
                onChangeText={setShopOwnerName}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 9876543210"
                placeholderTextColor={colors.text.muted}
                value={shopPhone}
                onChangeText={setShopPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Street / Market / Colony Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Shop 12, Main Market, Near Clock Tower"
              placeholderTextColor={colors.text.muted}
              value={street}
              onChangeText={setStreet}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kanpur"
                placeholderTextColor={colors.text.muted}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 208001"
                placeholderTextColor={colors.text.muted}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Special Delivery Instructions</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Deliver before 2 PM, call shopkeeper on arrival"
              placeholderTextColor={colors.text.muted}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* Section 2: Product & Carton Catalog Selector */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Package size={18} color={colors.gold.primary} />
            <Text style={styles.sectionTitle}>2. SELECT POOJA SAMAGRI & MASTER CARTONS</Text>
          </View>
          <Text style={styles.sectionSub}>
            Add quantities for the products requested by the shopkeeper.
          </Text>

          <View style={styles.productsList}>
            {products.map((p) => {
              const qty = selectedQuantities[p.id] || 0;
              return (
                <View key={p.id} style={styles.productRow}>
                  <View style={styles.productLeft}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.productCategory}>{p.category}</Text>
                    <Text style={styles.productPrice}>{formatCurrency(p.price)}</Text>
                  </View>

                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateProductQty(p.id, -1)}
                    >
                      <Minus size={14} color={colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.stepQty}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateProductQty(p.id, 1)}
                    >
                      <Plus size={14} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Section 3: Live Commission & Order Total Breakdown */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>3. FINANCIAL BREAKDOWN</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Selected Units:</Text>
            <Text style={styles.summaryValue}>
              {orderedItems.reduce((acc, it) => acc + it.quantity, 0)} units
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Carton Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Field Transport Shipping:</Text>
            <Text style={[styles.summaryValue, { color: colors.status.success }]}>
              FREE (Distributor Assisted)
            </Text>
          </View>

          <View style={styles.divider} />

          {/* 10% Commission Highlight */}
          <View style={styles.commissionBanner}>
            <Sparkles size={18} color={colors.gold.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.commissionTitle}>Your 10% Partner Commission:</Text>
              <Text style={styles.commissionSub}>
                Automatically added to your pending ledger upon booking
              </Text>
            </View>
            <Text style={styles.commissionAmount}>
              + {formatCurrency(commissionEarned)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Payable by Shopkeeper (COD):</Text>
              <Text style={styles.totalSub}>Cash collected upon factory delivery</Text>
            </View>
            <Text style={styles.grandTotal}>{formatCurrency(total)}</Text>
          </View>

          <View style={styles.bookBtnWrapper}>
            <GoldButton
              title={
                submitting
                  ? "Booking Field Order..."
                  : `Book Order & Earn ${formatCurrency(commissionEarned)}`
              }
              loading={submitting}
              icon={<CheckCircle2 size={18} color="#000" />}
              onPress={handleBookOrder}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  loaderText: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.gold.primary,
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  savedShopsSelector: {
    marginBottom: spacing.sm,
    backgroundColor: colors.background.secondary,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  selectorLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.gold.primary,
    marginBottom: 4,
  },
  shopsScroll: {
    gap: 6,
  },
  shopChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    marginRight: 6,
  },
  shopChipActive: {
    backgroundColor: colors.gold.surface,
    borderColor: colors.gold.primary,
  },
  shopChipText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  shopChipTextActive: {
    color: colors.gold.primary,
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.text.secondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    height: 42,
    color: colors.text.primary,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  productsList: {
    gap: spacing.xs,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  productLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  productCategory: {
    fontSize: 10,
    color: colors.text.muted,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.gold.primary,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  stepBtn: {
    padding: 6,
    paddingHorizontal: 8,
  },
  stepQty: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
    paddingHorizontal: 6,
  },
  summaryCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.xs,
  },
  commissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.gold,
    gap: spacing.xs,
  },
  commissionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  commissionSub: {
    fontSize: 10,
    color: colors.text.muted,
  },
  commissionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacing.xs,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  totalSub: {
    fontSize: 10,
    color: colors.text.muted,
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  bookBtnWrapper: {
    marginTop: spacing.xs,
  },
});
