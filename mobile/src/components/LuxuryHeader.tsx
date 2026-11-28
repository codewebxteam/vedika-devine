import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ShoppingBag, Heart, ArrowLeft } from "lucide-react-native";
import { COLORS, SPACING } from "../theme/colors";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface LuxuryHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showCart?: boolean;
  showWishlist?: boolean;
  onBackPress?: () => void;
}

export const LuxuryHeader: React.FC<LuxuryHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showCart = true,
  showWishlist = true,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { totalItems } = useCart();
  const { wishlistIds } = useWishlist();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.xs }]}>
      <View style={styles.content}>
        {/* Left Side: Back Button or Brand Logo */}
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => (onBackPress ? onBackPress() : navigation.goBack())}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={COLORS.goldLight} />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandRow}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.brandTitle}>VEDIKA DIVINE</Text>
                <Text style={styles.brandSubtitle}>RMPG POOJA SAMAGRI & AROMA</Text>
              </View>
            </View>
          )}
        </View>

        {/* Center Title if provided */}
        {title && (
          <View style={styles.center}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {/* Right Side: Wishlist and Cart Icons */}
        <View style={styles.right}>
          {showWishlist && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Wishlist")}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Heart size={20} color={wishlistIds.length > 0 ? COLORS.gold : COLORS.textMuted} />
              {wishlistIds.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{wishlistIds.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {showCart && (
            <TouchableOpacity
              onPress={() => navigation.navigate("CartTab")}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <ShoppingBag size={20} color={totalItems > 0 ? COLORS.goldLight : COLORS.textMuted} />
              {totalItems > 0 && (
                <View style={[styles.badge, styles.badgeGold]}>
                  <Text style={styles.badgeTextDark}>{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.textPrimary,
  },
  brandSubtitle: {
    fontSize: 8,
    fontWeight: "700",
    color: COLORS.goldLight,
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: SPACING.xs,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.goldLight,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeGold: {
    backgroundColor: COLORS.goldLight,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  badgeTextDark: {
    color: "#000000",
    fontSize: 9,
    fontWeight: "800",
  },
});
