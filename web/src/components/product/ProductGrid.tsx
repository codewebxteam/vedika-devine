import React from "react";
import { Product } from "@backend/index";
import { ProductCard } from "./ProductCard";

export const ProductGrid: React.FC<{
  products: Product[];
  theme?: "light" | "dark";
  emptyMessage?: string;
}> = ({
  products,
  theme = "light",
  emptyMessage = "No sacred candle items found matching your selection.",
}) => {
  if (products.length === 0) {
    return (
      <div
        className={`py-16 text-center rounded-3xl p-8 border ${
          theme === "dark"
            ? "bg-stone-900/60 border-amber-900/40 text-stone-300"
            : "bg-amber-50/50 border-amber-200 text-stone-700"
        }`}
      >
        <p className="font-serif text-lg font-bold mb-2">
          {emptyMessage}
        </p>
        <p className="text-xs text-stone-400 max-w-sm mx-auto">
          Try adjusting your search criteria or explore our other holy categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} theme={theme} />
      ))}
    </div>
  );
};
