import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { COLORS, SPACING, RADIUS } from "../theme/colors";

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "whatsapp";
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  variant = "primary",
}) => {
  const getBackgroundColor = () => {
    if (variant === "whatsapp") return COLORS.whatsapp;
    if (variant === "secondary") return COLORS.card;
    return COLORS.goldLight;
  };

  const getTextColor = () => {
    if (variant === "whatsapp") return "#FFFFFF";
    if (variant === "secondary") return COLORS.goldLight;
    return "#000000";
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === "secondary" && styles.secondaryBorder,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconBox}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
