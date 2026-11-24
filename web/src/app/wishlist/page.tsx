"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Flame } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product, getProductById, formatCurrency } from "@backend/index";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      setLoading(true);
      const items: Product[] = [];
      for (const id of wishlistIds) {
        const prod = await getProductById(id);
        if (prod) items.push(prod);
      }
      setProducts(items);
      setLoading(false);
    };

    fetchWishlistItems();
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="py-28 text-center space-y-4 bg-[#FFFDF9] min-h-screen">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif text-sm font-semibold text-black">
          Loading your saved candles...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center py-20 px-4 w-full">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border-2 border-amber-200 shadow-md">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-black">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            Save your favorite handcrafted scented candles, luxury frosted jars, and temple diyas here to purchase later.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-transform hover:scale-102 cursor-pointer"
            >
              <span>Explore Candle Collections</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] w-full max-w-full overflow-x-hidden">
      {/* Grand Luxury Header */}
      <section className="relative bg-[#0C0A09] text-white py-12 sm:py-16 border-b border-amber-900/50 overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Personal Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              My Saved Wishlist ({products.length})
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Your handpicked favorite aromatherapy candles ready to be added to cart.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs shadow-md hover:bg-amber-100 transition-all"
          >
            <span>Browse More Candles</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
          </Link>
        </div>
      </section>

      {/* Wishlist Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} theme="light" />
          ))}
        </div>
      </div>
    </div>
  );
}
