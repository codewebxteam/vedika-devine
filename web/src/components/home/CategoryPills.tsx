"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Category, CATEGORIES, getCategories } from "@backend/index";
import { ArrowRight, Sparkles } from "lucide-react";

export const CategoryPills: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([...CATEGORIES]);

  useEffect(() => {
    getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });
  }, []);
  return (
    <section className="relative bg-[#0C0A09] text-white py-14 sm:py-20 border-y border-amber-900/50 overflow-hidden select-none w-full max-w-full">
      {/* Background Opulent Golden Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-radial from-amber-500/10 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-radial from-amber-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Floating Golden Stars */}
      <div className="absolute top-8 left-[12%] text-amber-400/40 text-lg animate-pulse pointer-events-none">
        ✦
      </div>
      <div className="absolute bottom-8 right-[15%] text-amber-500/30 text-xl animate-pulse pointer-events-none">
        ✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header (Dark & Gold) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Curated Collections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Shop by <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">Candle Type</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
              Hand-poured for every sacred puja, relaxation corner, romantic dinner, and grand festive celebration.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-amber-400 text-amber-300 hover:text-black font-semibold text-xs border border-amber-400/40 hover:border-amber-400 transition-all duration-300 group shadow-md"
          >
            <span>Explore All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Dark Luxury Cards with Always-On Radiant Gold Halos) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-3xl bg-linear-to-b from-stone-900/95 via-[#181512] to-stone-950 border border-amber-400/60 transition-all duration-300 text-center shadow-[0_8px_32px_rgba(212,175,55,0.22),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_44px_rgba(212,175,55,0.38)] hover:border-amber-300 hover:-translate-y-1.5 overflow-hidden"
            >
              {/* Permanent Ambient Golden Light Reflex on the Card */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/25 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-600/20 rounded-full blur-2xl pointer-events-none" />

              {/* Product Image Area - Expanded to almost fully fill the box with permanent glowing halo */}
              <div className="relative w-full h-44 sm:h-52 flex items-center justify-center p-1 my-0.5">
                {/* Permanent Radiant Ambient Golden/White Glow Behind the Transparent Product */}
                <div className="absolute inset-0 bg-radial from-amber-400/40 via-amber-200/20 to-transparent rounded-full blur-2xl pointer-events-none scale-100" />

                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)] group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative z-10 flex flex-col items-center justify-center text-amber-400/70">
                    <Sparkles className="w-10 h-10 mb-1" />
                    <span className="text-[10px] text-stone-400">Vedika Divine</span>
                  </div>
                )}
              </div>

              {/* Title & Permanent Gold Action Label */}
              <div className="w-full pt-2 pb-0.5 border-t border-stone-800/80 relative z-10">
                <h3 className="font-serif font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                  <span>Shop Collection</span>
                  <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
