"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency, APP_CONFIG } from "@backend/index";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const freeShippingLeft = Math.max(0, APP_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / APP_CONFIG.FREE_SHIPPING_THRESHOLD) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-amber-200 flex items-center justify-between bg-[#0C0A09] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-serif font-bold text-white">
                My Sacred Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping bar */}
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 text-xs">
            {freeShippingLeft === 0 ? (
              <p className="font-semibold text-emerald-800 flex items-center gap-1">
                🎉 Congratulations! You unlocked FREE Express Doorstep Delivery.
              </p>
            ) : (
              <div>
                <p className="text-stone-700">
                  Add <span className="font-bold text-black">{formatCurrency(freeShippingLeft)}</span> more for{" "}
                  <span className="font-bold text-amber-800">FREE Shipping</span>!
                </p>
                <div className="w-full bg-amber-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-amber-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-stone-800 text-lg mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Fill your space with positive vibrations and authentic Vedic blessings.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors"
                >
                  Explore Sacred Items
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-amber-50 relative flex-shrink-0 border border-amber-200">
                    <img
                      src={item.product.thumbnail || item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900 line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-xs font-bold text-amber-700 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-amber-100 text-stone-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-amber-100 text-stone-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-amber-100 bg-amber-50/30 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold text-stone-900">
                <span>Subtotal</span>
                <span className="text-lg text-amber-800 font-bold">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-3 px-4 rounded-full border border-amber-400 text-black font-semibold text-xs hover:bg-amber-50 transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full text-center py-3 px-4 rounded-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md hover:scale-102 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Quick Checkout (COD)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
