import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Trash2, Plus, Minus, ShoppingBag, Truck, ArrowRight, Sparkles } from "lucide-react-native";
import { useCart } from "../context/CartContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { formatCurrency } from "@vedika/backend";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type CartNavProp = NativeStackNavigationProp<RootStackParamList>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartNavProp>();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    total,
    freeDeliveryThreshold,
  } = useCart();

  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeShippingProgress = Math.min(1, subtotal / freeDeliveryThreshold);

  const confirmClearCart = () => {
    Alert.alert("Clear Shopping Bag", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearCart },
    ]);
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Shopping Bag"
        subtitle={`${items.length} sacred items`}
        showBack={false}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <ShoppingBag size={48} color={colors.gold.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Bag is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Your royal sanctuary awaits. Explore our pure collection of Pooja Samagri, Bhimseni Kapur, Ghee Diyas & Hawan essentials.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate("MainTabs", { screen: "ShopTab" } as any)}
          >
            <Sparkles size={16} color="#000" />
            <Text style={styles.exploreButtonText}>Explore Pooja Samagri</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cartContent}>
          {/* Free Shipping Progress Indicator */}
          <View style={styles.shippingNotice}>
            <View style={styles.shippingHeader}>
              <Truck size={16} color={colors.gold.primary} />
              <Text style={styles.shippingText}>
                {remainingForFreeShipping === 0 ? (
                  <Text style={{ color: colors.status.success, fontWeight: "bold" }}>
                    🎉 Royal Privilege: You unlocked FREE Shipping!
                  </Text>
                ) : (
                  <>
                    Add <Text style={{ color: colors.gold.primary, fontWeight: "bold" }}>{formatCurrency(remainingForFreeShipping)}</Text> more for FREE Delivery
                  </>
                )}
              </Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${freeShippingProgress * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Cart Items List */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Image
                  source={{
                    uri:
                      item.product.images?.[0] ||
                      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80",
                  }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />

                <View style={styles.itemDetails}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.product.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Trash2 size={16} color={colors.text.muted} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.itemCategory}>{item.product.category}</Text>
                  <Text style={styles.itemPrice}>{formatCurrency(item.product.price)}</Text>

                  {/* Quantity Stepper */}
                  <View style={styles.itemBottomRow}>
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={14} color={colors.text.primary} />
                      </TouchableOpacity>
                      <Text style={styles.stepQty}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={14} color={colors.text.primary} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemSubtotal}>
                      {formatCurrency(item.product.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.clearBtn} onPress={confirmClearCart}>
                <Text style={styles.clearBtnText}>Empty Shopping Bag</Text>
              </TouchableOpacity>
            }
          />

          {/* Bill Summary & Sticky Checkout Bar */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery (Standard COD)</Text>
              <Text
                style={[
                  styles.summaryValue,
                  shippingFee === 0 && { color: colors.status.success },
                ]}
              >
                {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.taxInclusive}>Inclusive of all taxes</Text>
              </View>
              <Text style={styles.grandTotal}>{formatCurrency(total)}</Text>
            </View>

            <View style={styles.checkoutBtnWrapper}>
              <GoldButton
                title="Proceed to Royal Checkout"
                icon={<ArrowRight size={18} color="#000" />}
                onPress={() => navigation.navigate("Checkout")}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  cartContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gold.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  shippingNotice: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  shippingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: 6,
  },
  shippingText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.border.subtle,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.gold.primary,
  },
  listContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.xs,
  },
  itemCategory: {
    fontSize: 11,
    color: colors.text.muted,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gold.primary,
  },
  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    padding: 4,
    paddingHorizontal: 8,
  },
  stepQty: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
    paddingHorizontal: 6,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  clearBtn: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  clearBtnText: {
    fontSize: 12,
    color: colors.text.muted,
    textDecorationLine: "underline",
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    padding: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.xs,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  taxInclusive: {
    fontSize: 10,
    color: colors.text.muted,
  },
  grandTotal: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  checkoutBtnWrapper: {
    marginTop: 4,
  },
});
