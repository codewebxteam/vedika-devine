import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Heart, Plus, Star } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../theme/colors";
import { useCart, CartProduct } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const { width } = Dimensions.get("window");
export const CARD_WIDTH = (width - SPACING.md * 3) / 2;

interface ProductCardProps {
  product: any;
  onPress?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const navigation = useNavigation<any>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate("ProductDetail", {
        productId: product.id,
        productTitle: product.name,
      });
    }
  };

  const isFav = isInWishlist(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      {/* Product Image Box */}
      <View style={styles.imageBox}>
        <Image
          source={{
            uri:
              product.thumbnail ||
              "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleWishlist(product)}
          activeOpacity={0.7}
        >
          <Heart size={15} color={isFav ? COLORS.error : "#FFFFFF"} fill={isFav ? COLORS.error : "transparent"} />
        </TouchableOpacity>
      </View>

      {/* Details Section */}
      <View style={styles.info}>
        {/* Category Tag */}
        <Text style={styles.category} numberOfLines={1}>
          {product.category || "Pooja Samagri"}
        </Text>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={11} color={COLORS.goldLight} fill={COLORS.goldLight} />
          <Text style={styles.ratingText}>
            {product.rating ? product.rating.toFixed(1) : "4.9"}
          </Text>
          {product.burnTime && (
            <Text style={styles.burnTimeText}>• {product.burnTime}</Text>
          )}
        </View>

        {/* Price & Add to Cart Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceBox}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(product, 1)}
            activeOpacity={0.7}
          >
            <Plus size={16} color="#000000" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  imageBox: {
    width: "100%",
    height: CARD_WIDTH * 1.1,
    backgroundColor: COLORS.cardSecondary,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.goldLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  discountText: {
    color: "#000000",
    fontSize: 9,
    fontWeight: "800",
  },
  favButton: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 6,
    borderRadius: 20,
  },
  info: {
    padding: SPACING.sm,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  category: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.goldLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
    minHeight: 32,
    lineHeight: 16,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  burnTimeText: {
    fontSize: 9,
    color: COLORS.textDim,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.sm,
  },
  priceBox: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.goldLight,
  },
  originalPrice: {
    fontSize: 10,
    color: COLORS.textDim,
    textDecorationLine: "line-through",
  },
  addButton: {
    backgroundColor: COLORS.goldLight,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
});
