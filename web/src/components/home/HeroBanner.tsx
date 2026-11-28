"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Leaf,
  Truck,
  ShieldCheck,
  X,
  Flame,
} from "lucide-react";

export const HeroBanner: React.FC = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative w-full max-w-full bg-[#FFFDF9] overflow-hidden pt-6 sm:pt-12 lg:pt-16 pb-8 sm:pb-16 lg:pb-20 select-none flex flex-col justify-between">
      {/* 1. Subtle Ambient Foliage Framing (Desktop & Tablet only to keep mobile clean & legible) */}
      {/* Top-Left Corner Botanical Branch - Tucked elegantly in corner margin, never intruding on typography */}
      <svg
        className="hidden sm:block pointer-events-none select-none absolute top-0 left-0 w-24 sm:w-28 lg:w-34 h-auto opacity-70 blur-[0.6px] -translate-x-3 -translate-y-3 z-0"
        viewBox="0 0 160 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M-10 10 Q 45 45 65 110 T 80 155"
          stroke="#4A5840"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M15 25 C 2 8 30 -5 42 12 C 55 30 28 42 15 25 Z"
          fill="#58684C"
        />
        <path
          d="M36 48 C 22 30 50 16 62 34 C 74 52 48 66 36 48 Z"
          fill="#697C5B"
        />
        <path
          d="M50 82 C 32 68 62 50 78 68 C 94 86 66 98 50 82 Z"
          fill="#58684C"
        />
        <path
          d="M64 120 C 44 106 74 88 90 106 C 106 124 80 138 64 120 Z"
          fill="#697C5B"
        />
      </svg>

      {/* Right Margin Botanical Branch */}
      <svg
        className="hidden sm:block pointer-events-none select-none absolute top-20 sm:top-24 right-0 w-24 sm:w-32 lg:w-36 h-auto opacity-70 blur-[0.6px] translate-x-2 z-0"
        viewBox="0 0 160 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M180 20 Q 110 80 80 170 T 50 220"
          stroke="#4A5840"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M140 40 C 160 20 130 5 115 25 C 100 45 125 60 140 40 Z"
          fill="#5A6C4D"
        />
        <path
          d="M115 75 C 135 55 105 40 90 60 C 75 80 100 95 115 75 Z"
          fill="#6B7F5C"
        />
        <path
          d="M95 120 C 115 100 85 85 70 105 C 55 125 80 140 95 120 Z"
          fill="#5A6C4D"
        />
        <path
          d="M75 170 C 95 150 65 135 50 155 C 35 175 60 190 75 170 Z"
          fill="#4B5A3F"
        />
      </svg>

      {/* Bottom-Right Foreground Botanical Branch */}
      <svg
        className="hidden sm:block pointer-events-none select-none absolute bottom-4 right-0 w-32 sm:w-40 lg:w-48 h-auto opacity-70 blur-[1px] translate-x-3 z-0"
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M220 160 Q 140 120 70 80 T -10 60"
          stroke="#3F4D35"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M170 140 C 190 120 165 95 145 115 C 125 135 150 160 170 140 Z"
          fill="#4E5E41"
        />
        <path
          d="M125 110 C 145 90 120 65 100 85 C 80 105 105 130 125 110 Z"
          fill="#5D704E"
        />
        <path
          d="M80 85 C 100 65 75 40 55 60 C 35 80 60 105 80 85 Z"
          fill="#4E5E41"
        />
        <path
          d="M35 65 C 55 45 30 20 10 40 C -10 60 15 85 35 65 Z"
          fill="#3D4A32"
        />
      </svg>

      {/* 2. Warm Golden Light Pools & Bokeh Glow */}
      <div className="absolute top-10 right-1/4 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-radial from-amber-300/30 via-amber-200/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-8 left-1/6 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] bg-amber-100/35 rounded-full blur-3xl pointer-events-none z-0" />

      {/* 3. Luxury Floating Golden Sparkle Particles */}
      <div className="hidden sm:block absolute top-16 left-[18%] text-amber-500/50 text-xl animate-pulse pointer-events-none z-10">
        ✦
      </div>
      <div className="absolute top-20 right-[12%] sm:right-[32%] text-amber-500/40 text-lg sm:text-2xl animate-pulse pointer-events-none z-10">
        ✦
      </div>
      <div className="hidden sm:block absolute bottom-28 left-[38%] text-amber-500/30 text-lg pointer-events-none z-10">
        ✦
      </div>

      {/* 4. Luxury Polished White Carrara Marble Tabletop Foundation (Bottom 35%) */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] sm:h-[42%] pointer-events-none z-0 overflow-hidden">
        {/* Marble Base Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#FAF7F2]/80 to-[#F4EFE6]" />
        {/* Subtle Organic Marble Veins SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          preserveAspectRatio="none"
          viewBox="0 0 1200 300"
          fill="none"
        >
          <path
            d="M-50 180 Q 250 120 550 210 T 1250 160"
            stroke="#D4AF37"
            strokeWidth="1.2"
            strokeOpacity="0.25"
          />
          <path
            d="M50 250 Q 400 190 750 270 T 1300 230"
            stroke="#A8A29E"
            strokeWidth="1"
            strokeOpacity="0.2"
          />
        </svg>
        {/* High-Gloss Surface Reflection Highlight */}
        <div className="absolute top-0 inset-x-0 h-10 sm:h-14 bg-linear-to-b from-white/70 via-white/20 to-transparent" />
        {/* Warm Candle Pedestal Reflection Pool */}
        <div className="absolute bottom-6 sm:bottom-12 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-1/6 w-[260px] sm:w-[420px] h-[40px] sm:h-[50px] bg-radial from-amber-600/20 via-amber-400/10 to-transparent blur-xl rounded-full" />
      </div>

      {/* 5. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-8 items-center">
          {/* Left Column: Typography, Actions & Badges */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left pt-1 sm:pt-4">
            {/* Pill Capsule: Sacred Pooja Samagri & Divine Living */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-amber-400/90 bg-linear-to-r from-amber-50/80 via-white to-amber-50/80 text-black text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400" />
              <span>Sacred Pooja Samagri & Divine Living</span>
            </div>

            {/* Main Headline: Light Up Your Moments */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-black leading-[1.08] sm:leading-[1.06]">
              Sanctify <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-amber-400 to-amber-700">
                Your Mandir
                {/* Golden curved swoosh accent SVG under "Your Mandir" */}
                <svg
                  className="absolute -bottom-1.5 sm:-bottom-3.5 left-0 w-full h-2.5 sm:h-4.5 text-amber-500"
                  viewBox="0 0 250 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12C60 2 190 2 248 10"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-stone-700 text-xs sm:text-sm lg:text-base leading-relaxed max-w-md font-normal">
              100% Pure Bhimseni Kapur, Consecrated Cow Ghee Diyas, 51-Herb Hawan Samagri, Bamboo-Free Dhoop & Sacred Fragrances.
            </p>

            {/* Action Buttons: Pure Black Pill & White/Gold Play Button */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-medium text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-black cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </Link>

              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white hover:bg-amber-50/70 border border-amber-300 text-black text-xs sm:text-sm font-semibold transition-all shadow-xs group cursor-pointer hover:scale-105 active:scale-95"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-amber-400 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 ml-0.5" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Trust Badges Row (Natural Wax, Fast Delivery, Secure Payments) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 max-w-md border-t border-amber-200/70 text-black text-xs">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-black text-xs sm:text-sm leading-tight">
                    100%
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-600 font-medium">
                    Pure & Vedic
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-black text-xs sm:text-sm leading-tight">
                    Fast
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-600 font-medium">
                    Delivery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                </div>
                <div>
                  <p className="font-bold text-black text-xs sm:text-sm leading-tight">
                    Secure
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-600 font-medium">
                    Payments
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Candle Product Composition with Golden Arch Rings correctly centered behind candle */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center z-10 pt-2 lg:pt-0">
            {/* Opulent Golden Metallic Arch Rings (Framing the candle composition with ample breathing room from top bar) */}
            <div className="absolute top-[53%] sm:top-[51%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[270px] h-[270px] sm:w-[380px] sm:h-[380px] lg:w-[470px] lg:h-[470px] pointer-events-none z-0">
              {/* Outer Heavy Gold Metallic Ring */}
              <div className="absolute inset-0 rounded-full border-[3px] sm:border-[3.5px] border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.22)] opacity-85" />
              {/* Inner Concentric Gold Metallic Ring */}
              <div className="absolute inset-7 sm:inset-10 lg:inset-12 rounded-full border-[2px] sm:border-[2.5px] border-[#ECC95F] opacity-75" />
              {/* Delicate Accent Ring */}
              <div className="absolute inset-14 sm:inset-20 lg:inset-24 rounded-full border border-amber-300/40 opacity-55" />
            </div>

            {/* Soft Warm Radial Gold Spotlight behind candle */}
            <div className="absolute inset-0 bg-radial from-amber-300/25 via-amber-200/10 to-transparent rounded-full blur-2xl transform scale-105 pointer-events-none" />

            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-xl mx-auto group z-10">
              <img
                src="/images/hero.png"
                alt="Vedika Divine Vanilla Dream Scented Candle with Luxury Packaging & Flowers"
                className="w-full h-auto object-contain max-h-[300px] sm:max-h-[420px] lg:max-h-[520px] drop-shadow-[0_16px_36px_rgba(217,119,6,0.18)] mx-auto hover:scale-102 transition-transform duration-500"
              />

              {/* Floating Luxury Glassmorphism Badge */}
              <div className="relative sm:absolute -mt-2 sm:mt-0 sm:-bottom-2 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-300 shadow-xl flex items-center gap-2.5 sm:gap-3 mx-auto w-fit sm:w-auto">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black flex items-center justify-center text-amber-400 shrink-0">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                </div>
                <div className="text-left">
                  <p className="font-serif font-bold text-[11px] sm:text-xs text-black">
                    Vanilla Dream Aromatherapy
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-stone-600 font-medium">
                    🔥 50+ Hrs • 100% Pure Plant Soy Wax
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Scroll Down Mouse Indicator (Desktop / Tablet only, hidden on mobile for clean viewport) */}
        <div className="hidden sm:flex flex-col items-center justify-center pt-8 sm:pt-10 pb-1 text-stone-600 relative z-20">
          <div className="w-5 h-8 rounded-full border-2 border-amber-600/70 flex items-start justify-center p-1 bg-white shadow-2xs">
            <div className="w-1 h-2 rounded-full bg-amber-600 animate-bounce" />
          </div>
          <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-600 mt-2 flex items-center gap-3">
            <span className="w-12 sm:w-20 h-px bg-amber-300/70" />
            <span className="text-stone-800 tracking-[0.2em]">Scroll Down</span>
            <span className="w-12 sm:w-20 h-px bg-amber-300/70" />
          </span>
        </div>
      </div>

      {/* 6. Layered 3D Golden Ribbon Wave at Bottom */}
      <div className="relative w-full overflow-hidden leading-none pointer-events-none z-10 mt-4 sm:mt-2">
        <svg
          viewBox="0 0 1440 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12 lg:h-14"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="goldGradientMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#AA771C" />
              <stop offset="25%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#FFF3C4" />
              <stop offset="75%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#996515" />
            </linearGradient>
            <linearGradient id="goldGradientSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFF3C4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#996515" stopOpacity="0.15" />
            </linearGradient>
            <filter id="ribbonGlow" x="-5%" y="-20%" width="110%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#D4AF37" floodOpacity="0.3" />
            </filter>
          </defs>
          {/* Soft Golden Ribbon Body Fill */}
          <path
            d="M0 48 C260 14 480 66 760 30 C1040 -5 1260 50 1440 20 V68 H0 Z"
            fill="url(#goldGradientSheen)"
          />
          {/* Primary Crisp Gold Ribbon Line */}
          <path
            d="M0 48 C260 14 480 66 760 30 C1040 -5 1260 50 1440 20"
            stroke="url(#goldGradientMain)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#ribbonGlow)"
          />
          {/* Secondary Accent Gold Ribbon Line */}
          <path
            d="M0 54 C270 22 490 72 770 36 C1050 2 1270 56 1440 26"
            stroke="url(#goldGradientMain)"
            strokeWidth="1.5"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Video / Scent Crafting Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div
            className="bg-black border border-amber-500/60 rounded-3xl w-full max-w-2xl p-5 sm:p-8 text-white space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white bg-stone-900 border border-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base sm:text-lg">
                  Sacred Samagri & Divine Living at Kushinagar
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-300">
                  M/S RMPG Vedika Divine Home Industries
                </p>
              </div>
            </div>

            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-stone-950 border border-amber-900/40 flex items-center justify-center relative">
              <img
                src="/images/hero.png"
                alt="Sacred Crafting Preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-2 sm:space-y-3 bg-black/50">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-xl shadow-amber-500/40">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black ml-0.5 sm:ml-1" />
                </div>
                <div>
                  <p className="font-serif font-bold text-white text-sm sm:text-base">
                    Pure Vedic Purity & Temple Aromatherapy
                  </p>
                  <p className="text-[10px] sm:text-xs text-stone-300 max-w-sm mt-1">
                    Small-batch sacred essentials made with 100% pure Bhimseni kapur, natural cow ghee, herbal dhoop, and divine temple fragrances.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Link
                href="/shop"
                onClick={() => setVideoModalOpen(false)}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Explore Sacred Samagri
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
