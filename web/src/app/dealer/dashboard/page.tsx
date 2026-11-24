"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Package,
  Flame,
  Truck,
  Phone,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Product,
  getProducts,
  formatCurrency,
  APP_CONFIG,
  submitWholesaleInquiry,
} from "@backend/index";

export default function DealerDashboardPage() {
  const router = useRouter();
  const { user, profile, isDealer, loading, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCarton, setSelectedCarton] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [cartonQty, setCartonQty] = useState(10);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    const loadWholesale = async () => {
      setLoadingProducts(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        console.error(e);
      }
      setLoadingProducts(false);
    };
    loadWholesale();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-300">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-bold tracking-widest text-stone-400">
            Verifying Dealer Partner Session...
          </p>
        </div>
      </div>
    );
  }

  // Guard: If not logged in or not dealer
  if (!user || !isDealer) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Authorized Dealer Access Required
            </h2>
            <p className="text-xs text-stone-400 mt-2">
              This portal is exclusively reserved for approved wholesale candle dealers & retail partners.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/dealer/login"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Dealer Login
            </Link>
            <Link
              href="/dealer/register"
              className="w-full py-2.5 rounded-2xl bg-stone-950 border border-amber-800 text-amber-300 hover:bg-stone-800 text-xs font-semibold transition-colors"
            >
              Apply to Become a Partner
            </Link>
            <Link
              href="/"
              className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors pt-2"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const businessName =
    profile?.dealerInfo?.businessName || profile?.displayName || "Wholesale Partner";
  const contactPerson = profile?.dealerInfo?.contactPerson || profile?.displayName || "";
  const phone = profile?.dealerInfo?.phone || profile?.phoneNumber || "";
  const city = profile?.dealerInfo?.city || "India";

  const handlePlaceWholesaleOrder = async (product: Product) => {
    setSubmittingOrder(true);
    setOrderSuccess(null);
    try {
      await submitWholesaleInquiry({
        businessName,
        contactPerson,
        phone,
        city,
        estimatedQuantity: `${cartonQty} Master Cartons (${product.name})`,
        candleTypesNeeded: [product.name, product.category],
        message: `Direct dealer wholesale order for ${cartonQty} cartons of ${product.name} at dealer rate ₹${product.wholesalePrice || 180}/pc.`,
      });

      setOrderSuccess(
        `Wholesale order request for ${cartonQty} cartons of "${product.name}" received! Production dispatch manager will contact you on WhatsApp / Phone.`
      );
      setSelectedCarton(null);
    } catch (err: any) {
      alert(`Order error: ${err.message}`);
    }
    setSubmittingOrder(false);
  };

  const whatsappProductionUrl = `https://wa.me/918874205655?text=${encodeURIComponent(
    `Namaste, this is ${businessName} (Approved Dealer). I would like to place a new wholesale carton dispatch order.`
  )}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Dealer Navigation Bar */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="Vedika Divine Logo"
            className="h-10 w-auto object-contain rounded-xl bg-white/10 p-1 border border-stone-700 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-sm">
                VEDIKA DEALER PORTAL
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Partner</span>
              </span>
            </div>
            <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
              {businessName} • {city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={whatsappProductionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Factory WhatsApp</span>
          </a>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-linear-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-800/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="space-y-3 relative z-10 max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-block">
              🎉 Welcome, {contactPerson}!
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Wholesale Master Carton Dealer Rates
            </h1>
            <p className="text-xs text-stone-300 leading-relaxed">
              As an authorized partner of <strong>M/S RMPG Vedika Divine Home Industries</strong>, you get direct factory master carton pricing (up to 55% margin off M.R.P.), temperature-proof bubble carton packing, and priority manufacturing dispatch.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-200">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>All-India Transport Dispatch</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-200">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Minimum Order: 1 Master Carton (24/48 pcs)</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>GST B2B Tax Invoicing Available</span>
              </span>
            </div>
          </div>
        </div>

        {orderSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <p className="font-semibold leading-relaxed">{orderSuccess}</p>
          </div>
        )}

        {/* Wholesale Products Catalog Grid */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
            <div>
              <h2 className="font-bold text-white text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>Candle Varieties & Master Carton Pricing</span>
              </h2>
              <p className="text-xs text-stone-400">
                Compare retail MRP vs your exclusive partner wholesale rate
              </p>
            </div>
            <span className="text-xs text-stone-500">
              Showing {products.length} candle items
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => {
              const wholesaleRate = p.wholesalePrice || Math.round(p.price * 0.55);
              const margin = Math.round(((p.price - wholesaleRate) / p.price) * 100);

              return (
                <div
                  key={p.id}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-600/50 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-950 border border-stone-800">
                      <img
                        src={p.thumbnail}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-600 text-white shadow-md">
                        {margin}% Dealer Margin
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                        {p.category}
                      </span>
                      <h3 className="font-serif font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Specs pill */}
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-[10px] text-stone-400 space-y-1">
                      <p>
                        🔥 <strong>Burn:</strong> {p.burnTime || "50+ Hours"} •{" "}
                        {p.waxType || "Soy Wax"}
                      </p>
                      {p.fragranceNotes?.top && (
                        <p className="truncate">
                          🌸 <strong>Notes:</strong> {p.fragranceNotes.top}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Box & Order Button */}
                  <div className="pt-3 border-t border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">
                          Dealer Rate / Pc
                        </span>
                        <span className="font-serif font-bold text-amber-400 text-lg">
                          {formatCurrency(wholesaleRate)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 block">
                          Retail M.R.P.
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          {formatCurrency(p.originalPrice || p.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCarton(p)}
                      className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      <span>Order Master Cartons</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Order Modal */}
      {selectedCarton && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Wholesale Carton Request
                </span>
                <h3 className="font-bold text-white text-base">
                  {selectedCarton.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCarton(null)}
                className="text-stone-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <p>
                  <strong>Dealer:</strong> {businessName} ({contactPerson})
                </p>
                <p>
                  <strong>Delivery City:</strong> {city}
                </p>
                <p>
                  <strong>Wholesale Rate:</strong>{" "}
                  <span className="text-amber-400 font-bold">
                    {formatCurrency(selectedCarton.wholesalePrice || Math.round(selectedCarton.price * 0.55))} / piece
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1.5">
                  Quantity of Master Cartons (24 pcs / carton)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCartonQty(Math.max(1, cartonQty - 5))}
                    className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center"
                  >
                    -5
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={cartonQty}
                    onChange={(e) => setCartonQty(Number(e.target.value))}
                    className="w-24 text-center py-2 rounded-xl bg-stone-950 border border-stone-800 font-bold text-amber-400 text-base"
                  />
                  <button
                    onClick={() => setCartonQty(cartonQty + 5)}
                    className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center"
                  >
                    +5
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Total pieces: {cartonQty * 24} candles
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCarton(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePlaceWholesaleOrder(selectedCarton)}
                disabled={submittingOrder}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60"
              >
                {submittingOrder ? "Submitting..." : "Confirm & Send to Factory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
