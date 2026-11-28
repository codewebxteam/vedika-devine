import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme/colors";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          bg: COLORS.successBg,
          border: COLORS.success,
          text: "#6EE7B7",
        };
      case "shipped":
        return {
          bg: "rgba(59, 130, 246, 0.15)",
          border: "#3B82F6",
          text: "#93C5FD",
        };
      case "processing":
      case "confirmed":
        return {
          bg: COLORS.goldDark,
          border: COLORS.goldLight,
          text: COLORS.goldLighter,
        };
      case "cancelled":
        return {
          bg: COLORS.errorBg,
          border: COLORS.error,
          text: "#FCA5A5",
        };
      default:
        return {
          bg: COLORS.surface,
          border: COLORS.border,
          text: COLORS.textMuted,
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badge.bg,
          borderColor: badge.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: badge.text }]}>
        {status || "Confirmed"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
