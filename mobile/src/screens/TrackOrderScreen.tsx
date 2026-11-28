import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
} from "lucide-react-native";
import { trackOrderByOrderNumber, Order, formatCurrency, formatDate } from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { OrderStatusBadge } from "../components/OrderStatusBadge";
import { RootStackParamList } from "../navigation/types";

type TrackRouteProp = RouteProp<RootStackParamList, "TrackOrder">;
type TrackNavProp = NativeStackNavigationProp<RootStackParamList>;

export const TrackOrderScreen: React.FC = () => {
  const route = useRoute<TrackRouteProp>();
  const navigation = useNavigation<TrackNavProp>();

  const [orderQuery, setOrderQuery] = useState(route.params?.orderNumber || "");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async (searchTarget?: string) => {
    const target = (searchTarget || orderQuery).trim();
    if (!target) {
      setError("Please enter your Order Number (e.g. VD-12345678).");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await trackOrderByOrderNumber(target, phoneQuery.trim());
      if (res) {
        setOrder(res);
      } else {
        setOrder(null);
        setError("No matching order found. Please check your order number or phone.");
      }
    } catch (err: any) {
      console.warn("Track error:", err);
      setError("Failed to fetch order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (route.params?.orderNumber) {
      handleTrack(route.params.orderNumber);
    }
  }, [route.params?.orderNumber]);

  const steps = [
    { key: "Pending", label: "Order Received", hindi: "ऑर्डर प्राप्त", icon: Clock },
    { key: "Confirmed", label: "Confirmed & In Queue", hindi: "ऑर्डर कन्फर्म", icon: CheckCircle2 },
    { key: "Processing", label: "Hand-Packaging", hindi: "पैकिंग चल रही है", icon: Package },
    { key: "Shipped", label: "Dispatched & In Transit", hindi: "रास्ते में है", icon: Truck },
    { key: "Delivered", label: "Delivered to Sanctuary", hindi: "सफलतापूर्वक पहुँचा", icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Confirmed":
        return 1;
      case "Processing":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  const handleSupportWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Vedika Divine Support,\nI would like an update on my Order #${order?.orderNumber || orderQuery}.`
    );
    Linking.openURL(`https://wa.me/918874205655?text=${text}`);
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Track Shipment"
        subtitle="Live Courier & Packing Timeline"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchCard}>
          <Text style={styles.cardTitle}>ENTER ORDER NUMBER</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. VD-20251125-9988"
              placeholderTextColor={colors.text.muted}
              value={orderQuery}
              onChangeText={setOrderQuery}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => handleTrack()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Search size={18} color="#000" />
              )}
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <AlertCircle size={16} color={colors.status.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        {/* Found Order Timeline & Details */}
        {order && (
          <View style={styles.resultContainer}>
            {/* Header info */}
            <View style={styles.orderHeaderCard}>
              <View style={styles.orderNumberRow}>
                <View>
                  <Text style={styles.orderNumberTitle}>Order #{order.orderNumber}</Text>
                  <Text style={styles.orderDateText}>
                    Placed on {formatDate(order.createdAt)}
                  </Text>
                </View>
                <OrderStatusBadge status={order.status} />
              </View>

              {order.estimatedDelivery && (
                <View style={styles.deliveryEstimateRow}>
                  <Truck size={16} color={colors.gold.primary} />
                  <Text style={styles.deliveryEstimateText}>
                    Expected Delivery:{" "}
                    <Text style={{ color: colors.gold.primary, fontWeight: "bold" }}>
                      {order.estimatedDelivery}
                    </Text>
                  </Text>
                </View>
              )}
            </View>

            {/* 4-Step Vertical Progress Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>DISPATCH & DELIVERY PROGRESS</Text>

              <View style={styles.timelineList}>
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  const Icon = st.icon;

                  return (
                    <View key={st.key} style={styles.timelineItem}>
                      <View style={styles.stepIndicatorColumn}>
                        <View
                          style={[
                            styles.stepDot,
                            isDone && styles.stepDotDone,
                            isCurrent && styles.stepDotCurrent,
                          ]}
                        >
                          <Icon
                            size={14}
                            color={isDone ? "#000" : colors.text.muted}
                          />
                        </View>
                        {idx < steps.length - 1 && (
                          <View
                            style={[
                              styles.stepLine,
                              idx < currentStep && styles.stepLineDone,
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.stepTextColumn}>
                        <Text
                          style={[
                            styles.stepLabel,
                            isDone && styles.stepLabelDone,
                            isCurrent && styles.stepLabelCurrent,
                          ]}
                        >
                          {st.label}
                        </Text>
                        <Text style={styles.stepHindi}>{st.hindi}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Destination Address */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={colors.gold.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>Delivery Destination</Text>
                  <Text style={styles.detailValue}>
                    {order.shippingAddress.fullName}
                  </Text>
                  <Text style={styles.detailSub}>
                    {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.pincode}
                  </Text>
                </View>
              </View>
            </View>

            {/* Items Summary */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailLabel}>Items in Package</Text>
              {order.items.map((it, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {it.quantity}x {it.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(it.price * it.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.itemRow}>
                <Text style={styles.totalLabel}>Total Payable ({order.paymentMethod})</Text>
                <Text style={styles.totalValue}>{formatCurrency(order.total)}</Text>
              </View>
            </View>

            {/* WhatsApp Help CTA */}
            <TouchableOpacity
              style={styles.whatsAppHelpBtn}
              onPress={handleSupportWhatsApp}
            >
              <MessageCircle size={18} color="#25D366" />
              <Text style={styles.whatsAppHelpText}>Need Help with Delivery? Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}
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
  searchCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 11,
    color: colors.gold.primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    height: 44,
    color: colors.text.primary,
    fontSize: 14,
  },
  searchBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.gold.primary,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  errorText: {
    fontSize: 12,
    color: colors.status.error,
    flex: 1,
  },
  resultContainer: {
    gap: spacing.md,
  },
  orderHeaderCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  orderNumberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  orderNumberTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  orderDateText: {
    fontSize: 11,
    color: colors.text.muted,
  },
  deliveryEstimateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.surface,
    padding: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  deliveryEstimateText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  timelineCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  timelineTitle: {
    fontSize: 11,
    color: colors.gold.primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  timelineList: {
    paddingLeft: spacing.xs,
  },
  timelineItem: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  stepIndicatorColumn: {
    alignItems: "center",
    width: 28,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotDone: {
    backgroundColor: colors.gold.primary,
    borderColor: colors.gold.primary,
  },
  stepDotCurrent: {
    borderColor: colors.gold.primary,
    borderWidth: 2,
    shadowColor: colors.gold.primary,
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  stepLine: {
    width: 2,
    height: 36,
    backgroundColor: colors.border.subtle,
  },
  stepLineDone: {
    backgroundColor: colors.gold.primary,
  },
  stepTextColumn: {
    flex: 1,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "500",
  },
  stepLabelDone: {
    color: colors.text.primary,
    fontWeight: "600",
  },
  stepLabelCurrent: {
    color: colors.gold.primary,
    fontWeight: "bold",
  },
  stepHindi: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 1,
  },
  detailsCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.gold.primary,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  detailSub: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: spacing.xs,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  whatsAppHelpBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: "#25D366",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  whatsAppHelpText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#25D366",
  },
});
