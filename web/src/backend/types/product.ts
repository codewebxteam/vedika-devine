export interface FragranceNotes {
  top?: string;
  heart?: string;
  base?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  categorySlug: string;
  images: string[];
  thumbnail: string;
  stock: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  dimensions?: string;
  weight?: string;
  material?: string;
  burnTime?: string;
  fragranceNotes?: FragranceNotes;
  waxType?: string;
  wickType?: string;
  isWholesaleAvailable?: boolean;
  wholesalePrice?: number;
  wholesaleMinQty?: number;
  spiritualSignificance?: string;
  origin?: string;
  packagingUnit?: string;
  piecesPerPack?: number;
  cartonCapacity?: string;
  unitWeight?: string;
  cartonWeight?: string;
  cartonPrice?: number;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export type ProductFilterOptions = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price-asc" | "price-desc" | "rating" | "latest" | "popular";
  searchQuery?: string;
  featuredOnly?: boolean;
};
