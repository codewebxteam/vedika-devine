"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  PhoneCall,
  Mail,
  Flame,
  Truck,
  ShieldCheck,
  PackageCheck,
  ArrowRight,
  Send,
  MapPin,
  Globe,
} from "lucide-react";
import { submitWholesaleInquiry, APP_CONFIG } from "@backend/index";

export default function WholesalePage() {
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [estimatedQuantity, setEstimatedQuantity] = useState("50 - 100 units");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Bhimseni Pure Camphor",
  ]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const candleTypesList = [
    "Pure Bhimseni Camphor (भीमसेनी कपूर)",
    "Pure Cow Ghee Diya Batti (शुद्ध गाय का घी बत्ती)",
    "Natural Herbal Dhoop & Agarbatti (धूप एवं अगरबत्ती)",
    "Sampoorna Vedic Hawan Samagri (हवन सामग्री)",
    "Sacred Pooja Kits & Thali Essentials",
    "Aromatic & Temple Sacred Candles",
  ];

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactPerson || !phone || !city) return;
    setSubmitting(true);
    try {
      await submitWholesaleInquiry({
        businessName,
        contactPerson,
        phone,
        email,
        city,
        estimatedQuantity,
        candleTypesNeeded: selectedTypes,
        message,
      });
      setSubmitted(true);
    } catch (e) {
      console.warn("Error submitting inquiry", e);
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-14 border border-amber-900/60 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40">
            <Building2 className="w-3.5 h-3.5" />
            <span>{APP_CONFIG.COMPANY_LEGAL_NAME}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Wholesale Sacred Pooja Samagri & Dealer Partnership
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Supply your retail store, pooja bhandar, mandir trust, or regional distribution network directly from our manufacturing unit at Turkpatti Bazar, Kushinagar (UP). Enjoy direct factory pricing, pure ingredients, and pan-India dispatch.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/dealer/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <Building2 className="w-4 h-4 text-stone-950" />
              <span>Apply to Become a Partner 🤝</span>
            </Link>
            <Link
              href="/dealer/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Dealer Partner Login</span>
            </Link>
            <a
              href={`https://wa.me/91${APP_CONFIG.PHONE_RAW}?text=${encodeURIComponent(`Hello ${APP_CONFIG.BRAND_NAME}, I am interested in wholesale pooja samagri dealer rates.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <span>WhatsApp ({APP_CONFIG.PHONE_RAW})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Official Unit & Contact Info Card */}
      <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200/90 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-stone-700">
        <div className="space-y-1">
          <span className="font-bold text-amber-900 block text-sm">
            {APP_CONFIG.COMPANY_LEGAL_NAME} ({APP_CONFIG.ENTITY_TYPE})
          </span>
          <p className="flex items-center gap-1.5 text-stone-600">
            <MapPin className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
            {APP_CONFIG.REGISTERED_ADDRESS}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1 text-stone-800">
            <Mail className="w-3.5 h-3.5 text-amber-700" />
            {APP_CONFIG.SUPPORT_EMAIL}
          </span>
          <span className="flex items-center gap-1 text-stone-800">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            {APP_CONFIG.WEBSITE}
          </span>
        </div>
      </div>

      {/* Why Partner with Vedika Divine Candles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            45%+
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">
            High Profit Margins
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Factory-direct pricing cuts out middlemen, giving you 45% to 60% gross profit margins on retail shelf sales.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            MOQ 12
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">
            Low Minimum Order Quantity
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Start small with as few as 12-24 units per fragrance. Test demand in your local store without heavy capital lockup.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            Custom
          </div>
          <h3 className="font-serif font-bold text-base text-stone-900">
            Private Label & Custom Branding
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Custom jar colors, luxury gift boxes, and branded logo stickers available for corporate orders and wedding giveaways.
          </p>
        </div>
      </div>

      {/* Inquiry Form & Wholesale Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Submit Dealer / Bulk Inquiry
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Fill out your requirements below. Our wholesale manager will contact you within 2 business hours with catalog & price list.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-emerald-900">
                Inquiry Received Successfully!
              </h3>
              <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                Thank you, {contactPerson}. Our wholesale coordinator at {APP_CONFIG.COMPANY_LEGAL_NAME} will contact you shortly at <strong>{phone}</strong>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-emerald-800 underline pt-2 cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Business / Store / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Lotus Gift Boutique"
                    className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 8874205655"
                    className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="store@example.com"
                    className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City / State *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kushinagar, Gorakhpur, Lucknow..."
                    className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Expected Order Quantity
                </label>
                <select
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500 bg-white"
                >
                  <option value="24 - 50 units (Sample / Trial Tier)">24 - 50 units (Trial Master Carton)</option>
                  <option value="50 - 200 units (Store Stock Tier)">50 - 200 units (Retail Boutique Stock)</option>
                  <option value="200 - 500 units (Wedding / Event Tier)">200 - 500 units (Festive & Wedding Gifting)</option>
                  <option value="500+ units (Master Distributor Tier)">500+ units (Wholesale Distributor Tier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Pooja Samagri & Categories You Are Interested In:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {candleTypesList.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        selectedTypes.includes(type)
                          ? "bg-amber-100/70 border-amber-400 text-amber-950 font-semibold"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="accent-amber-600"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Additional Notes / Specific Requests
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your store, event date, or custom packaging needs..."
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "Sending Inquiry..." : "Submit Wholesale Inquiry"}</span>
              </button>
            </form>
          )}
        </div>

        {/* Pricing Tiers & Master Carton Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Wholesale Pricing Tiers
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                <div className="flex justify-between items-center font-bold text-stone-900">
                  <span>Tier 1: Boutiques & Salons</span>
                  <span className="text-amber-800">40% Off MRP</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">MOQ: 12-48 Units | Mix & Match Scents</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                <div className="flex justify-between items-center font-bold text-stone-900">
                  <span>Tier 2: Resellers & Wedding Planners</span>
                  <span className="text-amber-800">50% Off MRP</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">MOQ: 49-200 Units | Free Gift Box Packaging</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200/80">
                <div className="flex justify-between items-center font-bold text-stone-900">
                  <span>Tier 3: Master Distributors & Corporates</span>
                  <span className="text-amber-800">60% Off MRP</span>
                </div>
                <p className="text-stone-500 text-[11px] mt-0.5">MOQ: 200+ Units | Custom Logo & Jar Labeling</p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200">
              <Link
                href="/shop?category=wholesale-bulk-packs"
                className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Order Ready Master Cartons Online</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
