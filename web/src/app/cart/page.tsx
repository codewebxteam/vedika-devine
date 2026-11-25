"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Sparkles,
  Truck,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency, APP_CONFIG } from "@backend/index";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "VEDIKA10" || code === "DIVINE10") {
      const discount = Math.round(subtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponMessage("✨ 10% Luxury Candle Discount Applied!");
    } else if (code === "VEDIKA100" && subtotal >= 999) {
      setAppliedDiscount(100);
      setCouponMessage("✨ ₹100 Aroma Blessing Coupon Applied!");
    } else {
      setAppliedDiscount(0);
      setCouponMessage("Invalid coupon code. Try 'VEDIKA10'");
    }
  };

  const shippingFee =
    subtotal >= APP_CONFIG.FREE_SHIPPING_THRESHOLD || subtotal === 0
      ? 0
      : APP_CONFIG.SHIPPING_FEE;
  const finalTotal = Math.max(0, subtotal - appliedDiscount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center py-20 px-4 w-full">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-xl text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border-2 border-amber-200 shadow-md">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-black">
            Your Candle Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            Discover our pure soy wax candles, artisanal aromatherapy jars, temple Akhand diyas, and bubble pillars.
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
              <span>Checkout Bag</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              My Luxury Candle Cart
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Review your artisanal candle selections before safe doorstep delivery.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
          >
            Clear Entire Bag
          </button>
        </div>
      </section>

      {/* Cart Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-amber-200 divide-y divide-amber-100 overflow-hidden shadow-sm">
              {items.map((item) => (
                <div key={item.productId} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 p-1 shrink-0 overflow-hidden">
                      {item.product?.thumbnail ? (
                        <img src={item.product.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-700">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-serif font-bold text-base text-black hover:text-amber-800 transition-colors line-clamp-1">
                          {item.product?.name || "Handcrafted Candle"}
                        </h3>
                      </Link>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formatCurrency(item.price)} each
                      </p>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-1 inline-block">
                        100% Pure Soy Wax
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-amber-50">
                    {/* Quantity Selector */}
                    <div className="inline-flex items-center border border-amber-300 rounded-full bg-white shadow-2xs">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 text-stone-600 hover:text-black cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-black min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 text-stone-600 hover:text-black cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-serif font-bold text-base text-black">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Shipping Reassurance Bar */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-stone-700 font-medium">
                <Truck className="w-4 h-4 text-amber-700" />
                {subtotal >= APP_CONFIG.FREE_SHIPPING_THRESHOLD ? (
                  <strong className="text-emerald-800 font-bold">
                    🎉 You have unlocked FREE Express Doorstep Delivery!
                  </strong>
                ) : (
                  <span>
                    Add <strong>{formatCurrency(APP_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more for FREE Shipping
                  </span>
                )}
              </span>
              <span className="text-amber-800 font-bold">
                Threshold: ₹{APP_CONFIG.FREE_SHIPPING_THRESHOLD}
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-amber-200 shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-xl text-black border-b border-amber-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-bold text-black">{formatCurrency(subtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Aroma Discount</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Standard Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">FREE</strong> : formatCurrency(shippingFee)}</span>
                </div>

                <div className="pt-3 border-t border-amber-100 flex justify-between text-base">
                  <span className="font-serif font-bold text-black">Total Amount</span>
                  <span className="font-serif font-bold text-xl text-black">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. VEDIKA10)"
                    className="flex-1 p-2.5 rounded-xl border border-amber-300 text-xs text-black uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] font-semibold ${appliedDiscount > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                    {couponMessage}
                  </p>
                )}
              </form>

              {/* Proceed to Checkout CTA */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-extrabold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Quick Checkout (COD)</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </Link>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>100% Safe Fragile Delivery • Cash on Delivery (COD) Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
