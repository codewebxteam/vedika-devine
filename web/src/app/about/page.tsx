"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Building2,
  MapPin,
  ShieldCheck,
  Heart,
  Award,
  ArrowRight,
  CheckCircle2,
  Factory,
} from "lucide-react";
import { APP_CONFIG } from "@backend/index";

export default function AboutPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 1. Opulent Hero Banner (Dark Mode: Royal Black & Gold) */}
      <section className="relative bg-[#0C0A09] text-white py-16 sm:py-24 border-b border-amber-900/50 overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Our Artisanal Heritage & Purity</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Crafted with Purity, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">
              Lit with Divine Devotion
            </span>
          </h1>

          <p className="text-stone-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            {APP_CONFIG.COMPANY_LEGAL_NAME} is an authentic candle manufacturer headquartered at Turkpatti Bazar, Kushinagar (Uttar Pradesh), dedicated to bringing pure light, sustainable plant soy wax, and soothing aromatherapy into Indian homes and temples.
          </p>
        </div>
      </section>

      {/* 2. Core Pillars (Light Mode: White & Gold) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Guiding Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mt-1">
            Pure Ingredients, Zero Compromise
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Every creation reflects our commitment to natural well-being, clean indoor air, and artisanal craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4 hover:shadow-xl hover:border-amber-400 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-bold shadow-md">
              <Flame className="w-7 h-7 fill-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-black">100% Plant Soy Wax</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              We never use toxic petroleum paraffin. Our candles are hand-poured using clean-burning, renewable soy wax infused with therapeutic essential oils for clean indoor air.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4 hover:shadow-xl hover:border-amber-400 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-bold shadow-md">
              <Building2 className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-black">Direct Kushinagar Unit</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Manufactured with artisan pride at Turkpatti Bazar, Kushinagar (UP). From temple Akhand diyas to luxury frosted glass jars and wholesale dealer master cartons.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4 hover:shadow-xl hover:border-amber-400 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center font-bold shadow-md">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-black">B2B Wholesale & Retail</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Whether you are an individual customer shopping for your home altar or a retail store owner seeking master cartons, we deliver pan-India with safe packaging.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Official Manufacturing Credentials (Dark Mode) */}
      <section className="bg-[#0C0A09] text-white py-16 sm:py-24 border-y border-amber-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 rounded-full">
                Manufacturing Entity Details
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                {APP_CONFIG.COMPANY_LEGAL_NAME}
              </h2>
              <p className="text-amber-300 font-semibold text-xs tracking-wider">
                ENTITY TYPE: {APP_CONFIG.ENTITY_TYPE}
              </p>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Operating under registered standards, our Kushinagar factory combines ancient Vedic devotion with modern international candle pouring techniques. We supply retail boutique stores, spiritual ashrams, wedding decorators, and authorized regional distributors across all Indian states.
              </p>

              <div className="space-y-2.5 text-xs text-stone-300 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{APP_CONFIG.REGISTERED_ADDRESS}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>GST Registered & Pan-India Authorized Logistics Partnered</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/wholesale"
                  className="px-8 py-3 rounded-full bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg"
                >
                  Become a Dealer Partner
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs border border-stone-800"
                >
                  Contact Factory Unit
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl p-2 bg-black">
                <img
                  src="/images/hero.png"
                  alt="Vedika Divine Artisan Unit"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
