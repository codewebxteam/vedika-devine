import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react-native";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder, formatCurrency } from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type CheckoutNavProp = NativeStackNavigationProp<RootStackParamList>;

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutNavProp>();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user, profile } = useAuth();

  // Address State (pre-filled if profile has saved address)
  const savedAddr = profile?.addresses?.[0];
  const [fullName, setFullName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [street, setStreet] = useState(savedAddr?.street || "");
  const [city, setCity] = useState(savedAddr?.city || "");
  const [stateName, setStateName] = useState(savedAddr?.state || "Uttar Pradesh");
  const [pincode, setPincode] = useState(savedAddr?.pincode || "");

  // Payment Selection: "Cash on Delivery" or "UPI / Online Payment"
  const [paymentMethod, setPaymentMethod] = useState<"Cash on Delivery" | "UPI / Online Payment">(
    "Cash on Delivery"
  );
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (!fullName.trim()) {
      Alert.alert("Missing Detail", "Please provide your full name for delivery.");
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 10) {
      Alert.alert("Missing Detail", "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!street.trim()) {
      Alert.alert("Missing Detail", "Please enter your street address / house number.");
      return;
    }
    if (!city.trim() || !pincode.trim()) {
      Alert.alert("Missing Detail", "Please provide your city and 6-digit pincode.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        userId: user ? user.uid : "guest_" + Date.now(),
        userEmail: user?.email || `customer.${phone.replace(/[^0-9]/g, "")}@vedikadivine.guest`,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images?.[0] || "",
        })),
        subtotal,
        shippingFee,
        discount: 0,
        total,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      });

      clearCart();

      navigation.replace("OrderSuccess", {
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        orderId: order.id,
      });
    } catch (err: any) {
      console.warn("Failed to place order:", err);
      Alert.alert("Order Error", err.message || "Failed to confirm order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Checkout"
        subtitle="Express Delivery to your Sanctuary"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Shipping Address Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MapPin size={18} color={colors.gold.primary} />
            <Text style={styles.sectionTitle}>1. Delivery Address</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Recipient Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Maharani Ananya Sharma"
              placeholderTextColor={colors.text.muted}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor={colors.text.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Flat / House / Street Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Villa 14, Royal Palm Residency, Civil Lines"
              placeholderTextColor={colors.text.muted}
              value={street}
              onChangeText={setStreet}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Lucknow"
                placeholderTextColor={colors.text.muted}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 226001"
                placeholderTextColor={colors.text.muted}
                value={pincode}
                onChangeText={setPincode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Uttar Pradesh"
              placeholderTextColor={colors.text.muted}
              value={stateName}
              onChangeText={setStateName}
            />
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <CreditCard size={18} color={colors.gold.primary} />
            <Text style={styles.sectionTitle}>2. Payment Method</Text>
          </View>

          {/* COD Option (Recommended) */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "Cash on Delivery" && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod("Cash on Delivery")}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.radioOuter}>
                {paymentMethod === "Cash on Delivery" && <View style={styles.radioInner} />}
              </View>
              <Banknote size={20} color={colors.gold.primary} />
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.paymentTitle}>Cash on Delivery (COD)</Text>
                  <View style={styles.badgeGold}>
                    <Text style={styles.badgeGoldText}>POPULAR</Text>
                  </View>
                </View>
                <Text style={styles.paymentDesc}>Pay securely at your doorstep in cash</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* UPI / Online Option */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "UPI / Online Payment" && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod("UPI / Online Payment")}
          >
            <View style={styles.paymentLeft}>
              <View style={styles.radioOuter}>
                {paymentMethod === "UPI / Online Payment" && <View style={styles.radioInner} />}
              </View>
              <CreditCard size={20} color={colors.gold.primary} />
              <View>
                <Text style={styles.paymentTitle}>UPI / Net Banking / Cards</Text>
                <Text style={styles.paymentDesc}>GPay, PhonePe, Paytm, Cards</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary Review */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Order Overview</Text>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Items Count:</Text>
            <Text style={styles.overviewValue}>{items.length} sacred items</Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Subtotal:</Text>
            <Text style={styles.overviewValue}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Delivery Charge:</Text>
            <Text
              style={[
                styles.overviewValue,
                shippingFee === 0 && { color: colors.status.success },
              ]}
            >
              {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.overviewTotalRow}>
            <Text style={styles.overviewTotalLabel}>Payable Total:</Text>
            <Text style={styles.overviewTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Guarantee Badge */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={20} color={colors.gold.primary} />
          <Text style={styles.guaranteeText}>
            100% Satisfaction & Authenticity Guaranteed by Vedika Divine Luxury Fragrances.
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <GoldButton
            title={
              submitting
                ? "Securing Order..."
                : `Confirm Order (${formatCurrency(total)})`
            }
            loading={submitting}
            icon={<Lock size={16} color="#000" />}
            onPress={handlePlaceOrder}
          />
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  formGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 12,
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
    height: 44,
    color: colors.text.primary,
    fontSize: 14,
  },
  textArea: {
    height: 60,
    textAlignVertical: "top",
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  paymentOptionActive: {
    borderColor: colors.gold.primary,
    backgroundColor: colors.gold.surface,
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gold.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold.primary,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  paymentDesc: {
    fontSize: 11,
    color: colors.text.muted,
  },
  badgeGold: {
    backgroundColor: colors.gold.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  badgeGoldText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000",
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  overviewLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  overviewValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.xs,
  },
  overviewTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  overviewTotalLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  overviewTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  guaranteeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.gold.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
    marginBottom: spacing.md,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 11,
    color: colors.gold.light,
    lineHeight: 16,
  },
  actionContainer: {
    marginTop: spacing.xs,
  },
});
