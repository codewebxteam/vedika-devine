import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Sparkles, MessageCircle, ShieldCheck, Flame, ChevronRight, Truck, ArrowRight } from "lucide-react-native";
import { COLORS, SPACING, RADIUS } from "../theme/colors";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { ProductCard } from "../components/ProductCard";
import { getProducts, Product, CATEGORIES } from "@backend/index";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.warn("Error loading home products:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWhatsAppSupport = () => {
    Linking.openURL("https://wa.me/918874205655?text=Namaste%20Vedika%20Divine,%20I%20have%20an%20enquiry%20regarding%20pooja%20samagri.");
  };

  const bestsellers = products.slice(0, 6);

  return (
    <View style={styles.container}>
      <LuxuryHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor={COLORS.goldLight}
          />
        }
      >
        {/* 1. Hero Luxury Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.tagBadge}>
            <Sparkles size={12} color={COLORS.goldLight} fill={COLORS.goldLight} />
            <Text style={styles.tagText}>100% PURE VEDIC & SACRED INGREDIENTS</Text>
          </View>

          <Text style={styles.heroHeading}>
            Sacred Pooja Samagri &{"\n"}
            <Text style={styles.heroHeadingGold}>Divine Living Essentials</Text>
          </Text>

          <Text style={styles.heroSubtext}>
            Pure Bhimseni camphor, cow ghee diyas, herbal dhoop, hawan essentials & divine living from Kushinagar.
          </Text>

          <View style={styles.heroButtonsRow}>
            <TouchableOpacity
              style={styles.heroPrimaryBtn}
              onPress={() => navigation.navigate("ShopTab")}
              activeOpacity={0.8}
            >
              <Text style={styles.heroPrimaryBtnText}>Explore Shop</Text>
              <ArrowRight size={14} color="#000000" strokeWidth={3} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              onPress={handleWhatsAppSupport}
              activeOpacity={0.8}
            >
              <MessageCircle size={15} color={COLORS.whatsapp} />
              <Text style={styles.heroSecondaryBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Trust Badges Row */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Truck size={14} color={COLORS.goldLight} />
            <Text style={styles.trustText}>Free Delivery ₹499+</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Flame size={14} color={COLORS.goldLight} />
            <Text style={styles.trustText}>Clean Smokeless Burn</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <ShieldCheck size={14} color={COLORS.goldLight} />
            <Text style={styles.trustText}>Cash on Delivery</Text>
          </View>
        </View>

        {/* 3. Browse Categories Carousel */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>CURATED COLLECTIONS</Text>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopTab")}
            style={styles.viewAllRow}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={14} color={COLORS.goldLight} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ShopTab", { categorySlug: cat.slug })}
            >
              <Image
                source={{ uri: cat.image }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryOverlay}>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {cat.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 4. Sacred Bestsellers Grid */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTag}>HANDPICKED FAVORITES</Text>
            <Text style={styles.sectionTitle}>Bestselling Fragrances</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ShopTab")}
            style={styles.viewAllRow}
          >
            <Text style={styles.viewAllText}>All Essentials</Text>
            <ChevronRight size={14} color={COLORS.goldLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {bestsellers.map((prod) => (
            <ProductCard key={prod.id} product={prod as any} />
          ))}
        </View>

        {/* 5. Wholesale & Dealer Partner Card */}
        <View style={styles.dealerBanner}>
          <Text style={styles.dealerTag}>WHOLESALE & DISTRIBUTOR NETWORK</Text>
          <Text style={styles.dealerTitle}>Become a Vedika Divine Partner</Text>
          <Text style={styles.dealerSub}>
            Direct manufacturing unit rates on master cartons (24 pcs) with regional territory protection & up to 15% dealer commission.
          </Text>
          <TouchableOpacity
            style={styles.dealerBtn}
            onPress={() => navigation.navigate("Wholesale")}
            activeOpacity={0.8}
          >
            <Text style={styles.dealerBtnText}>Explore Wholesale Cartons</Text>
            <ArrowRight size={14} color="#000000" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.huge,
  },
  heroBanner: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(217, 119, 6, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.3)",
    marginBottom: SPACING.sm,
  },
  tagText: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.goldLight,
    letterSpacing: 0.5,
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textPrimary,
    lineHeight: 26,
  },
  heroHeadingGold: {
    color: COLORS.goldLight,
  },
  heroSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  heroButtonsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  heroPrimaryBtn: {
    flex: 1,
    backgroundColor: COLORS.goldLight,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  heroPrimaryBtnText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 12,
  },
  heroSecondaryBtn: {
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroSecondaryBtnText: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 12,
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardSecondary,
    marginHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trustText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  trustDivider: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTag: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.goldLight,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 11,
    color: COLORS.goldLight,
    fontWeight: "700",
  },
  categoryScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  categoryCard: {
    width: 110,
    height: 130,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(12, 10, 9, 0.85)",
    padding: 6,
  },
  categoryName: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 13,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
  },
  dealerBanner: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(217, 119, 6, 0.4)",
    marginTop: SPACING.md,
  },
  dealerTag: {
    fontSize: 9,
    fontWeight: "800",
    color: COLORS.goldLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  dealerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  dealerSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  dealerBtn: {
    backgroundColor: COLORS.goldLight,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dealerBtnText: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 12,
  },
});
