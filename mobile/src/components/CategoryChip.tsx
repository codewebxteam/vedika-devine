import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, RADIUS } from "../theme/colors";

interface CategoryChipProps {
  label?: string;
  title?: string;
  isActive?: boolean;
  selected?: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  title,
  isActive,
  selected,
  onPress,
}) => {
  const active = isActive ?? selected ?? false;
  const displayText = label || title || "";

  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.textActive]}>{displayText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  chipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.goldLight,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  textActive: {
    color: "#000000",
    fontWeight: "800",
  },
});
