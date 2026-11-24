"use client";

import React from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check, Flame, Sparkles } from "lucide-react";
import { Product, formatCurrency } from "@backend/index";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface ProductCardProps {
  product: Product;
  theme?: "light" | "dark";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  theme = "light",
}) => {
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inCart = items.some((i) => i.productId === product.id);
  const isWishlisted = isInWishlist(product.id);
  const isDark = theme === "dark";

  return (
    <div
      className={`group rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
        isDark
          ? "bg-stone-900/90 border border-amber-900/50 hover:border-amber-400 hover:shadow-[0_12px_35px_rgba(212,175,55,0.2)]"
          : "bg-white border border-amber-200/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10"
      }`}
    >
      {/* Product Image & Badges */}
      <div
        className={`relative aspect-square w-full overflow-hidden ${
          isDark ? "bg-black" : "bg-amber-50/40"
        }`}
      >
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.burnTime && (
            <span className="bg-black/90 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-md flex items-center gap-1 border border-amber-500/40">
              <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.burnTime}
            </span>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs w-max tracking-wide">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all z-10 cursor-pointer ${
            isDark
              ? "bg-black/80 hover:bg-black text-amber-300 border border-amber-500/30"
              : "bg-white/90 hover:bg-white text-stone-600 hover:text-amber-800"
          }`}
          title="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted
                ? "fill-rose-500 text-rose-500"
                : isDark
                ? "text-amber-300"
                : "text-stone-600"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag */}
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block ${
              isDark ? "text-amber-400" : "text-amber-800"
            }`}
          >
            {product.category}
          </span>

          {/* Candle Title */}
          <Link href={`/product/${product.id}`}>
            <h3
              className={`font-serif font-bold text-sm sm:text-base transition-colors line-clamp-2 mt-1 leading-snug ${
                isDark
                  ? "text-white group-hover:text-amber-300"
                  : "text-black group-hover:text-amber-800"
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          {product.shortDescription && (
            <p
              className={`text-xs line-clamp-1 mt-1 ${
                isDark ? "text-stone-400" : "text-stone-600"
              }`}
            >
              {product.shortDescription}
            </p>
          )}

          {/* Customer Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span
                className={`text-xs font-bold ml-1 ${
                  isDark ? "text-amber-200" : "text-black"
                }`}
              >
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span
              className={`text-[11px] ${
                isDark ? "text-stone-500" : "text-stone-500"
              }`}
            >
              ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price & Add to Bag CTA */}
        <div
          className={`pt-3 flex items-center justify-between border-t ${
            isDark ? "border-amber-950/80" : "border-amber-100"
          }`}
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-lg font-bold font-serif ${
                  isDark ? "text-amber-300" : "text-black"
                }`}
              >
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span
                  className={`text-xs line-through ${
                    isDark ? "text-stone-500" : "text-stone-400"
                  }`}
                >
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              100% Plant Soy Wax
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md ${
              inCart
                ? "bg-amber-400 text-black hover:bg-amber-300"
                : isDark
                ? "bg-white hover:bg-amber-400 text-black hover:text-black"
                : "bg-black hover:bg-stone-900 text-white"
            }`}
            title={inCart ? "In your cart (Click to add more)" : "Add Candle to Bag"}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
