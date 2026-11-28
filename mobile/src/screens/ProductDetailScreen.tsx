import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Star,
  Heart,
  Share2,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react-native";
import { getProductById, Product, formatCurrency } from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { GoldButton } from "../components/GoldButton";
import { RootStackParamList } from "../navigation/types";

type DetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { productId } = route.params;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const item = await getProductById(productId);
        setProduct(item);
      } catch (err) {
        console.warn("Error fetching product detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Discover ${product.name} by Vedika Divine Sacred Pooja Samagri: ₹${product.price}.\nhttps://vedikadivine.com/product/${product.id}`,
      });
    } catch (e) {
      console.warn("Share failed", e);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    Alert.alert("Added to Bag", `${quantity}x ${product.name} has been added to your shopping bag.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigation.navigate("Checkout");
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.gold.primary} />
        <Text style={styles.loaderText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Product Not Found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Return to Shop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discountText =
    product.originalPrice && product.originalPrice > product.price
      ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
      : null;

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Product Details"
        subtitle={product.category}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product Image Viewer */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                images[selectedImageIndex] ||
                "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Floating Actions on Image */}
          <View style={styles.imageFloatingBar}>
            <TouchableOpacity
              style={styles.floatingIconBtn}
              onPress={() => toggleWishlist(product)}
            >
              <Heart
                size={20}
                color={isWishlisted ? colors.status.error : colors.text.primary}
                fill={isWishlisted ? colors.status.error : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingIconBtn} onPress={handleShare}>
              <Share2 size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {discountText && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountText}</Text>
            </View>
          )}
        </View>

        {/* Thumbnail Gallery (if multiple images) */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbStrip}>
            {images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImageIndex(idx)}
                style={[
                  styles.thumbWrapper,
                  selectedImageIndex === idx && styles.thumbWrapperActive,
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Title & Brand Information */}
        <View style={styles.detailsCard}>
          <View style={styles.ratingRow}>
            <View style={styles.starBadge}>
              <Star size={14} color="#000" fill="#000" />
              <Text style={styles.starText}>{product.rating?.toFixed(1) || "4.9"}</Text>
            </View>
            <Text style={styles.ratingCount}>
              ({product.reviewCount || 48} verified reviews)
            </Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.stockStatus}>
              {product.stock > 0 ? "In Stock (Ready to Dispatch)" : "Made to Order"}
            </Text>
          </View>

          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.shortDescription || "Hand-Poured Soy Wax Luxury"}</Text>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatCurrency(product.price)}</Text>
            {product.originalPrice && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>{formatCurrency(product.originalPrice)}</Text>
            )}
            <View style={styles.codPill}>
              <CheckCircle2 size={12} color={colors.status.success} />
              <Text style={styles.codPillText}>Cash on Delivery Available</Text>
            </View>
          </View>
        </View>

        {/* Trust Badges Bar */}
        <View style={styles.trustBar}>
          <View style={styles.trustItem}>
            <Flame size={18} color={colors.gold.primary} />
            <Text style={styles.trustTitle}>Pure Soy</Text>
            <Text style={styles.trustSub}>100% Organic</Text>
          </View>
          <View style={styles.trustItem}>
            <Clock size={18} color={colors.gold.primary} />
            <Text style={styles.trustTitle}>{product.burnTime || "50+ Hours"}</Text>
            <Text style={styles.trustSub}>Clean Burn</Text>
          </View>
          <View style={styles.trustItem}>
            <Truck size={18} color={colors.gold.primary} />
            <Text style={styles.trustTitle}>Pan-India</Text>
            <Text style={styles.trustSub}>Fast Delivery</Text>
          </View>
          <View style={styles.trustItem}>
            <ShieldCheck size={18} color={colors.gold.primary} />
            <Text style={styles.trustTitle}>Handcrafted</Text>
            <Text style={styles.trustSub}>Zero Toxins</Text>
          </View>
        </View>

        {/* Fragrance Notes Profile */}
        {product.fragranceNotes && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Sparkles size={18} color={colors.gold.primary} />
              <Text style={styles.sectionTitle}>Aromatic Fragrance Pyramid</Text>
            </View>
            <View style={styles.notesContainer}>
              {product.fragranceNotes.top && (
                <View style={styles.noteRow}>
                  <Text style={styles.noteLabel}>Top Notes:</Text>
                  <Text style={styles.noteValue}>{product.fragranceNotes.top}</Text>
                </View>
              )}
              {product.fragranceNotes.heart && (
                <View style={styles.noteRow}>
                  <Text style={styles.noteLabel}>Heart Notes:</Text>
                  <Text style={styles.noteValue}>{product.fragranceNotes.heart}</Text>
                </View>
              )}
              {product.fragranceNotes.base && (
                <View style={styles.noteRow}>
                  <Text style={styles.noteLabel}>Base Notes:</Text>
                  <Text style={styles.noteValue}>{product.fragranceNotes.base}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Product Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this Sacred Item</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Specifications */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Product Specifications</Text>
          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Wax Material</Text>
              <Text style={styles.specValue}>{product.waxType || "100% Natural Soy Wax"}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Wick Material</Text>
              <Text style={styles.specValue}>{product.wickType || "Pure Cotton Lead-Free"}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Net Weight</Text>
              <Text style={styles.specValue}>{product.weight || "220g"}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Vessel Type</Text>
              <Text style={styles.specValue}>{product.material || "Hand-Cast Ceramic Glass"}</Text>
            </View>
          </View>
        </View>

        {/* Extra Bottom Padding for Sticky Bottom Bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        {/* Quantity Controls */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus size={16} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Plus size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Dual Actions: Add to Bag & Buy Now (COD) */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
            <ShoppingBag size={18} color={colors.gold.primary} />
            <Text style={styles.addToCartText}>Add to Bag</Text>
          </TouchableOpacity>

          <View style={styles.buyNowWrapper}>
            <GoldButton
              title="Buy Now (COD)"
              onPress={handleBuyNow}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
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
  errorText: {
    fontSize: typography.h3.fontSize,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.gold.surface,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: colors.gold.primary,
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 340,
    backgroundColor: colors.background.secondary,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageFloatingBar: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  floatingIconBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(12, 10, 9, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    backgroundColor: colors.gold.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    fontSize: typography.caption.fontSize,
    color: "#000",
    fontWeight: "bold",
  },
  thumbStrip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  thumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
    marginRight: spacing.xs,
  },
  thumbWrapperActive: {
    borderColor: colors.gold.primary,
    borderWidth: 2,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  detailsCard: {
    padding: spacing.md,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  starBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    gap: 3,
  },
  starText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  ratingCount: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.text.muted,
  },
  stockStatus: {
    fontSize: 12,
    color: colors.status.success,
    fontWeight: "500",
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.text.muted,
    textDecorationLine: "line-through",
  },
  codPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  codPillText: {
    fontSize: 11,
    color: colors.status.success,
    fontWeight: "600",
  },
  trustBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  trustItem: {
    alignItems: "center",
  },
  trustTitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
  trustSub: {
    fontSize: 10,
    color: colors.text.muted,
  },
  sectionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
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
    marginBottom: spacing.xs,
  },
  notesContainer: {
    gap: 6,
  },
  noteRow: {
    flexDirection: "row",
  },
  noteLabel: {
    width: 90,
    fontSize: 13,
    color: colors.gold.primary,
    fontWeight: "600",
  },
  noteValue: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  specItem: {
    width: "47%",
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.sm,
  },
  specLabel: {
    fontSize: 11,
    color: colors.text.muted,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  qtyButton: {
    padding: spacing.sm,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.text.primary,
    paddingHorizontal: spacing.xs,
  },
  actionButtonsRow: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gold.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    gap: 6,
    backgroundColor: colors.gold.surface,
  },
  addToCartText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.gold.primary,
  },
  buyNowWrapper: {
    flex: 1.2,
  },
});
