import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Search, SlidersHorizontal, X } from "lucide-react-native";
import { getProducts, getCategories } from "@vedika/backend";
import { Product, Category } from "@vedika/backend";
import { colors, typography, spacing, borderRadius } from "../theme/colors";
import { ProductCard } from "../components/ProductCard";
import { CategoryChip } from "../components/CategoryChip";
import { LuxuryHeader } from "../components/LuxuryHeader";
import { RootStackParamList, MainTabParamList } from "../navigation/types";

type ShopNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ShopRouteProp = RouteProp<MainTabParamList, "ShopTab">;

export const ShopScreen: React.FC = () => {
  const navigation = useNavigation<ShopNavigationProp>();
  const route = useRoute<ShopRouteProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route.params?.categorySlug || "all"
  );
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "rating" | "popular" | undefined>(
    "popular"
  );
  const [showSortModal, setShowSortModal] = useState(false);

  useEffect(() => {
    if (route.params?.categorySlug) {
      setSelectedCategory(route.params.categorySlug);
    }
  }, [route.params?.categorySlug]);

  const loadData = async () => {
    try {
      const [fetchedCategories, fetchedProducts] = await Promise.all([
        getCategories(),
        getProducts({
          category: selectedCategory === "all" ? undefined : selectedCategory,
          searchQuery: searchQuery.trim() || undefined,
          sortBy: sortBy,
        }),
      ]);
      setCategories(fetchedCategories);
      setProducts(fetchedProducts);
    } catch (err) {
      console.warn("Failed to load shop products:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = () => {
    setLoading(true);
    loadData();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const sortOptions = [
    { label: "Bestsellers & Popular", value: "popular" },
    { label: "Price: Low to High (कम से ज्यादा)", value: "price-asc" },
    { label: "Price: High to Low (ज्यादा से कम)", value: "price-desc" },
    { label: "Highest Customer Rating", value: "rating" },
  ];

  return (
    <View style={styles.container}>
      <LuxuryHeader
        title="Royal Collection"
        subtitle="Pure Pooja Samagri, Ghee Diyas & Hawan Essentials"
        showBack={false}
      />

      {/* Search Bar & Filter Toggle */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pooja samagri, kapur, dhoop, diyas..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                loadData();
              }}
            >
              <X size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(!showSortModal)}
        >
          <SlidersHorizontal size={18} color={colors.gold.primary} />
        </TouchableOpacity>
      </View>

      {/* Sort Options Dropdown */}
      {showSortModal && (
        <View style={styles.sortDropdown}>
          <Text style={styles.sortDropdownTitle}>SORT BY:</Text>
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.sortOptionItem,
                sortBy === opt.value && styles.sortOptionItemActive,
              ]}
              onPress={() => {
                setSortBy(opt.value as any);
                setShowSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === opt.value && styles.sortOptionTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category Pills Bar */}
      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: "all", name: "All Essentials", slug: "all" }, ...categories]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <CategoryChip
              title={item.name}
              selected={selectedCategory === item.slug}
              onPress={() => setSelectedCategory(item.slug)}
            />
          )}
        />
      </View>

      {/* Product Results Grid */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.gold.primary} />
          <Text style={styles.loaderText}>Loading divine creations...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.gold.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No Sacred Items Found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or category filter.
              </Text>
              <TouchableOpacity
                style={styles.clearFilterButton}
                onPress={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
              >
                <Text style={styles.clearFilterText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate("ProductDetail", {
                    productId: item.id,
                    productTitle: item.name,
                  })
                }
              />
            </View>
          )}
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
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    height: 44,
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
  },
  sortButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    justifyContent: "center",
    alignItems: "center",
  },
  sortDropdown: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  sortDropdownTitle: {
    fontSize: typography.caption.fontSize,
    color: colors.gold.primary,
    fontWeight: "700",
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  sortOptionItem: {
    paddingVertical: spacing.xs,
  },
  sortOptionItemActive: {
    backgroundColor: colors.gold.surface,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  sortOptionText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  sortOptionTextActive: {
    color: colors.gold.primary,
    fontWeight: "600",
  },
  categoryBar: {
    paddingBottom: spacing.xs,
  },
  categoryList: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
  },
  gridContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
  },
  emptyContainer: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: typography.h3.fontSize,
    color: colors.text.primary,
    fontWeight: "bold",
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  clearFilterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.gold.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.gold,
  },
  clearFilterText: {
    color: colors.gold.primary,
    fontWeight: "600",
  },
});
