import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from "lucide-react-native";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { formatCurrency } from "@vedika/backend";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { RootStackParamList } from "../navigation/types";

type WishlistNavProp = NativeStackNavigationProp<RootStackParamList>;

export const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<WishlistNavProp>();
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    Alert.alert("Moved to Bag", `${product.name} has been added to your shopping bag.`);
  };

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Wishlist"
        subtitle={`${items.length} saved treasures`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Heart size={44} color={colors.gold.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite sacred pooja essentials, camphor, dhoop & fragrances to revisit anytime.
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate("MainTabs", { screen: "ShopTab" } as any)}
          >
            <Sparkles size={16} color="#000" />
            <Text style={styles.exploreBtnText}>Discover Pooja Samagri</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    productId: item.id,
                    productTitle: item.name,
                  })
                }
              >
                <Image
                  source={{
                    uri:
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=80",
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeFromWishlist(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Trash2 size={16} color={colors.text.muted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>

                <TouchableOpacity
                  style={styles.moveBtn}
                  onPress={() => handleMoveToCart(item)}
                >
                  <ShoppingBag size={14} color="#000" />
                  <Text style={styles.moveBtnText}>Move to Bag</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.clearAllBtn}
              onPress={() => {
                Alert.alert(
                  "Clear Wishlist",
                  "Are you sure you want to remove all saved items?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Clear All", style: "destructive", onPress: clearWishlist },
                  ]
                );
              }}
            >
              <Text style={styles.clearAllText}>Clear All Wishlist Items</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gold.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gold.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    flexDirection: "row",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.xs,
  },
  category: {
    fontSize: 11,
    color: colors.text.muted,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gold.primary,
  },
  moveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: 6,
    gap: 4,
  },
  moveBtnText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  clearAllBtn: {
    alignSelf: "center",
    paddingVertical: spacing.md,
  },
  clearAllText: {
    fontSize: 12,
    color: colors.text.muted,
    textDecorationLine: "underline",
  },
});
