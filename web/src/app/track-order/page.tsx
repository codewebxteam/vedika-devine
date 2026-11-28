"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Search,
  Truck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  Phone,
  Flame,
} from "lucide-react";
import { Order, trackOrderByOrderNumber } from "@backend/index";
import { OrderTrackingModal } from "@/components/orders/OrderTrackingModal";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (initialOrderId) {
      handleSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = async (targetId?: string) => {
    const q = (targetId || orderNumber).trim();
    if (!q) {
      setError("Please enter your Order Number (e.g., VD-12345678 or Order ID).");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const order = await trackOrderByOrderNumber(q, contact);
      if (order) {
        setFoundOrder(order);
      } else {
        setError(
          "We couldn't locate an order matching those details. Please double-check your Order Number or phone number."
        );
        setFoundOrder(null);
      }
    } catch (e: any) {
      setError("An error occurred while tracking your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-10 shadow-xl shadow-amber-900/5 space-y-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 uppercase tracking-wider">
              Order Number / Order ID *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. VD-12345678 or 8-digit order ID"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-amber-300 text-black text-xs font-mono uppercase placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <Package className="w-4 h-4 text-amber-700 absolute left-3.5 top-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 uppercase tracking-wider">
              Registered Mobile Number or Email (Optional verification)
            </label>
            <div className="relative">
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="10-digit phone number or email address"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-amber-300 text-black text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <Phone className="w-4 h-4 text-amber-700 absolute left-3.5 top-4" />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-black hover:scale-101"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span>Searching Courier Records...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                <span>Track Package Live</span>
                <ArrowRight className="w-4 h-4 text-amber-400 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Quick Member Shortcut */}
        <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-600">
          <span>Already have an account? Sign in to view all your past orders at once.</span>
          <Link
            href="/orders"
            className="font-bold text-amber-800 hover:text-black underline shrink-0"
          >
            View My Orders →
          </Link>
        </div>
      </div>

      {/* Live Tracking Modal when found */}
      {foundOrder && (
        <OrderTrackingModal
          order={foundOrder}
          onClose={() => setFoundOrder(null)}
        />
      )}
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] w-full max-w-full overflow-x-hidden">
      {/* Luxury Hero Header */}
      <section className="relative bg-[#0C0A09] text-white py-14 sm:py-20 border-b border-amber-900/50 overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Vedika Divine Courier Fulfillment</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Track Your Sacred Order
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Enter your Order Number and registered Mobile or Email below to view live handcrafting milestones, dispatch details, and courier tracking.
          </p>
        </div>
      </section>

      {/* Main Tracking Form & Results Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl border border-amber-200/90 p-12 text-center text-xs text-stone-500 space-y-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading tracking console...</p>
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </div>
    </div>
  );
}
