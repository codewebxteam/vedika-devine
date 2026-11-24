import React from "react";
import { Sparkles, Flame, ShieldCheck, Building2, Award, HeartHandshake } from "lucide-react";

export const DivineValues: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 bg-[#FFFDF9] border-y border-amber-200/60 overflow-hidden select-none w-full max-w-full">
      {/* Ambient Warm Golden Pools */}
      <div className="absolute top-10 left-1/4 w-[380px] h-[380px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Marble Veins SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 400"
        fill="none"
      >
        <path d="M-50 200 Q 350 140 750 260 T 1300 210" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M100 320 Q 500 220 900 340 T 1350 280" stroke="#A8A29E" strokeWidth="1" strokeOpacity="0.25" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400 bg-white text-stone-900 text-xs font-semibold tracking-wider uppercase shadow-xs mb-3">
            <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
            <span>The Vedika Quality Guarantee</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black tracking-tight">
            Why Resellers, Decorators & Devotees{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-amber-400 to-amber-700">
              Choose Our Candles
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Every candle is hand-poured with sustainable plant soy wax, zero toxic paraffin, and therapeutic grade fragrances.
          </p>
        </div>

        {/* 4 Pillars Grid (Pure White, Gold & Black Luxury) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-13 h-13 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
              <Sparkles className="w-6 h-6 fill-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:text-amber-800 transition-colors">
              100% Plant Soy Wax
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Zero toxic petroleum paraffin. Pure biodegradable plant wax that burns up to 50% longer and completely clean.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-13 h-13 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:text-amber-800 transition-colors">
              Soot-Free Clean Burn
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Equipped with lead-free braided cotton and crackling FSC-certified wood wicks for an even melt pool without black smoke.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-13 h-13 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:text-amber-800 transition-colors">
              Rich Fragrance Throw
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              High fragrance load of 8-10% with IFRA certified essential oils ensuring strong hot and cold throw that fills entire rooms.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-7 rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-13 h-13 rounded-2xl bg-black text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="font-serif font-bold text-base text-black mb-2 group-hover:text-amber-800 transition-colors">
              Wholesale Dealer Margins
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Direct factory pricing with 45-55% profit margin for retail shopkeepers, wedding planners, and corporate resellers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
