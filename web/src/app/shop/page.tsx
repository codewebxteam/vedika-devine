"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Flame, Check } from "lucide-react";
import { Product, getProducts, CATEGORIES, Category, getCategories } from "@backend/index";
import { ProductGrid } from "@/components/product/ProductGrid";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("q") || "";

  const [categories, setCategories] = useState<Category[]>([...CATEGORIES]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating">("popular");
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });
  }, []);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      const data = await getProducts({
        category: selectedCategory || undefined,
        searchQuery: searchQuery || undefined,
        maxPrice: maxPrice || undefined,
        sortBy,
      });
      setProducts(data);
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedCategory, searchQuery, sortBy, maxPrice]);

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setMaxPrice(5000);
    setSortBy("popular");
  };

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-[#FFFDF9] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 1. Grand Luxury Header Banner (Strictly Gold, White & Black) */}
      <section className="relative bg-[#0C0A09] text-white py-12 sm:py-16 border-b border-amber-900/50 overflow-hidden w-full">
        {/* Ambient Gold Radial Glow Pools */}
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-radial from-amber-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        {/* Decorative Golden Sparkles */}
        <div className="absolute top-6 left-[10%] text-amber-400/40 text-xl animate-pulse pointer-events-none">
          ✦
        </div>
        <div className="absolute bottom-6 right-[12%] text-amber-500/35 text-2xl animate-pulse pointer-events-none">
          ✦
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Handcrafted Candle Catalog</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {selectedCategory ? (
              <>
                Collection:{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">
                  {currentCategoryObj?.name || selectedCategory}
                </span>
              </>
            ) : searchQuery ? (
              <>
                Search Results:{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">
                  &quot;{searchQuery}&quot;
                </span>
              </>
            ) : (
              <>
                All Artisanal{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">
                  Scented Candles
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            100% pure plant soy wax, IFRA therapeutic grade fragrances, crackling wood wicks, and lead-free cotton wicks hand-poured in Kushinagar.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-semibold text-amber-300/90">
            <span className="px-3 py-1 rounded-full bg-stone-900 border border-amber-900/60">
              🔥 50+ Hours Clean Burn
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900 border border-amber-900/60">
              🌿 Zero Paraffin Wax
            </span>
            <span className="px-3 py-1 rounded-full bg-stone-900 border border-amber-900/60">
              📦 Pan-India Safe Delivery
            </span>
          </div>
        </div>
      </section>

      {/* 2. Main Shop Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Controls Bar: Results Count, Mobile Filter Trigger, Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-amber-200/70 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-xs font-semibold shadow-md border border-black cursor-pointer hover:bg-stone-900"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters ({[selectedCategory, searchQuery, maxPrice < 5000].filter(Boolean).length})</span>
            </button>

            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Showing <strong className="text-black font-bold">{products.length}</strong> luxury candle offerings
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-amber-300/80 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-black shadow-2xs hover:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated ★</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedCategory || searchQuery || maxPrice < 5000) && (
          <div className="flex flex-wrap items-center gap-2 mb-8 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 text-xs">
            <span className="text-stone-600 font-medium">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-semibold border border-amber-300 shadow-2xs">
                <span>Category: {currentCategoryObj?.name || selectedCategory}</span>
                <button onClick={() => setSelectedCategory("")} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5 text-amber-700 hover:text-rose-600" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-semibold border border-amber-300 shadow-2xs">
                <span>Query: &quot;{searchQuery}&quot;</span>
                <button onClick={() => setSearchQuery("")} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5 text-amber-700 hover:text-rose-600" />
                </button>
              </span>
            )}
            {maxPrice < 5000 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-semibold border border-amber-300 shadow-2xs">
                <span>Max: ₹{maxPrice}</span>
                <button onClick={() => setMaxPrice(5000)} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3.5 h-3.5 text-amber-700 hover:text-rose-600" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 hover:underline font-bold ml-2 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar (Luxury Card with Gold Touches) */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-amber-200 shadow-sm sticky top-28">
            <div>
              <h3 className="font-serif font-bold text-black text-sm mb-4 flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-700" />
                  <span>Candle Categories</span>
                </span>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory("")} className="text-[10px] text-amber-700 hover:underline">
                    Clear
                  </button>
                )}
              </h3>

              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    !selectedCategory
                      ? "bg-black text-white shadow-xs"
                      : "text-stone-700 hover:bg-amber-50"
                  }`}
                >
                  <span>All Collections</span>
                  {!selectedCategory && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-black text-white shadow-xs"
                          : "text-stone-700 hover:bg-amber-50"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-6 border-t border-amber-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-black text-sm">
                  Price Limit
                </h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  ₹{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={5000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-amber-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-medium">
                <span>₹300</span>
                <span>₹2,500</span>
                <span>₹5,000+</span>
              </div>
            </div>

            {/* Quality Reassurance Card */}
            <div className="p-4 rounded-2xl bg-[#0C0A09] text-white space-y-2 border border-amber-900/60 shadow-md">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                <span>The Vedika Promise</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Hand-poured at Kushinagar with pure plant soy wax, zero toxic fumes, and long-lasting aroma.
              </p>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-24 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-serif text-sm font-semibold text-black">
                  Loading artisanal candle offerings...
                </p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                theme="light"
                emptyMessage="No candle creations found matching your filter criteria."
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto ml-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-amber-100 pb-4">
                <h3 className="font-serif font-bold text-lg text-black flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  <span>Filter Candles</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-stone-500 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Pills */}
              <div>
                <p className="font-bold text-xs text-stone-700 uppercase tracking-wider mb-3">
                  Categories
                </p>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                      !selectedCategory ? "bg-black text-white" : "text-stone-700 hover:bg-amber-50"
                    }`}
                  >
                    All Collections
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === cat.slug ? "bg-black text-white" : "text-stone-700 hover:bg-amber-50"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Max Price</span>
                  <span className="text-amber-800">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={5000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-amber-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-stone-500 font-medium">Loading candle catalog...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
