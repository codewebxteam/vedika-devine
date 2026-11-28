import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  CheckCircle,
  Package,
  Calendar,
  MessageCircle,
  Home,
  Truck,
  Sparkles,
} from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { formatCurrency } from "@vedika/backend";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type SuccessRouteProp = RouteProp<RootStackParamList, "OrderSuccess">;
type SuccessNavProp = NativeStackNavigationProp<RootStackParamList>;

export const OrderSuccessScreen: React.FC = () => {
  const route = useRoute<SuccessRouteProp>();
  const navigation = useNavigation<SuccessNavProp>();
  const { orderNumber, total, paymentMethod, shopPhone, shopName } = route.params;

  const handleOpenWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `*VEDIKA DIVINE - SACRED POOJA SAMAGRI ORDER CONFIRMED*\n\n` +
      `✨ *Order Number:* ${orderNumber}\n` +
      `💰 *Total Amount:* ₹${total.toLocaleString("en-IN")}\n` +
      `💳 *Payment Method:* ${paymentMethod}\n` +
      (shopName ? `🏪 *Retail Shop:* ${shopName}\n` : "") +
      `📦 *Status:* Confirmed (Preparing for Dispatch)\n\n` +
      `Thank you for choosing Vedika Divine. Your sanctuary of sacred pooja essentials awaits.`
    );

    const targetPhone = shopPhone || "918874205655";
    const cleanPhone = targetPhone.replace(/[^0-9]/g, "");
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${text}`).catch(() => {
      // Fallback to native share
      Share.share({
        message: `Order #${orderNumber} Confirmed with Vedika Divine! Total: ₹${total}`,
      });
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <CheckCircle size={56} color={colors.gold.primary} />
          </View>
          <Text style={styles.greetingTitle}>Sacred Order Confirmed</Text>
          <Text style={styles.greetingSubtitle}>
            Your sacred pooja essentials are being hand-packaged with exquisite Vedic care.
          </Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.card}>
          <View style={styles.orderNumberRow}>
            <Text style={styles.label}>ORDER NUMBER</Text>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <Package size={18} color={colors.gold.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Order Status</Text>
              <Text style={styles.infoValue}>Confirmed & In Processing</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <Calendar size={18} color={colors.gold.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Estimated Delivery</Text>
              <Text style={styles.infoValue}>3 to 5 Business Days</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconWrapper}>
              <Sparkles size={18} color={colors.gold.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={styles.infoLabel}>Payment Mode</Text>
              <Text style={styles.infoValue}>{paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Payable</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* WhatsApp Notification CTA */}
        <TouchableOpacity
          style={styles.whatsAppButton}
          onPress={handleOpenWhatsAppConfirmation}
        >
          <MessageCircle size={20} color="#fff" />
          <Text style={styles.whatsAppButtonText}>
            {shopPhone ? "Share Order on WhatsApp with Dukandar" : "Send Receipt to WhatsApp"}
          </Text>
        </TouchableOpacity>

        {/* Track Order Button */}
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate("TrackOrder", { orderNumber })}
        >
          <Truck size={18} color={colors.gold.primary} />
          <Text style={styles.trackButtonText}>Track Delivery Status</Text>
        </TouchableOpacity>

        {/* Return to Home */}
        <View style={styles.homeBtnWrapper}>
          <GoldButton
            title="Return to Sanctuary"
            icon={<Home size={18} color="#000" />}
            onPress={() => navigation.navigate("MainTabs", { screen: "HomeTab" } as any)}
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
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gold.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  card: {
    width: "100%",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  orderNumberRow: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: 11,
    color: colors.gold.primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: 6,
  },
  infoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.text.muted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  whatsAppButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  whatsAppButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold.surface,
    borderWidth: 1,
    borderColor: colors.border.gold,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  trackButtonText: {
    color: colors.gold.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  homeBtnWrapper: {
    width: "100%",
  },
});
