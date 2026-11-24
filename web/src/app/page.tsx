import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Gift,
  Star,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Award,
  Sparkle,
} from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryPills } from "@/components/home/CategoryPills";
import { DivineValues } from "@/components/home/DivineValues";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getFeaturedProducts, getBestSellers } from "@backend/index";

export default async function HomePage() {
  const featuredCandles = await getFeaturedProducts(8);
  const bestSellers = await getBestSellers(4);

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col">
      {/* 1. HERO SECTION — [LIGHT MODE: Pure White, Gold & Black] */}
      <HeroBanner />

      {/* 2. CATEGORY PILLS — [DARK MODE: Obsidian Black & Royal Gold] */}
      <CategoryPills />

      {/* 3. AROMATHERAPY MOOD SELECTOR & FEATURED PRODUCTS — [LIGHT MODE: Pure White & Gold] */}
      <section className="relative bg-[#FFFDF9] py-16 sm:py-24 border-b border-amber-200/60 overflow-hidden w-full max-w-full">
        {/* Ambient Warm Golden Pools */}
        <div className="absolute top-12 right-1/4 w-[420px] h-[420px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-1/4 w-[360px] h-[360px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* 3A. Shop by Fragrance Mood (Retail Aromatherapy Guide) */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400 bg-white text-black text-xs font-semibold tracking-wider uppercase shadow-xs mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Aromatherapy Mood Selector</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black tracking-tight">
                Shop by{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-amber-400 to-amber-700">
                  Fragrance Mood
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-xl mx-auto leading-relaxed">
                Find the perfect ambient aroma to complement your daily rituals, meditation, focus hours, and serene sleep.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Calm Mood */}
              <Link
                href="/shop?q=lavender"
                className="group p-6 rounded-3xl bg-white border border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10 transition-all text-center space-y-2.5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition-transform">
                  🌙
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-black group-hover:text-amber-800 transition-colors">
                  Deep Sleep & Calm
                </h3>
                <p className="text-xs text-stone-500">French Lavender & Chamomile</p>
                <span className="text-[11px] font-bold text-amber-700 underline block pt-1 group-hover:text-amber-900">
                  Explore Calm Scents →
                </span>
              </Link>

              {/* Sacred Mood */}
              <Link
                href="/shop?q=sandalwood"
                className="group p-6 rounded-3xl bg-white border border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10 transition-all text-center space-y-2.5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition-transform">
                  🪵
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-black group-hover:text-amber-800 transition-colors">
                  Warm Woody & Sacred
                </h3>
                <p className="text-xs text-stone-500">Mysore Sandalwood & Amber</p>
                <span className="text-[11px] font-bold text-amber-700 underline block pt-1 group-hover:text-amber-900">
                  Explore Woody Scents →
                </span>
              </Link>

              {/* Bakery Sweet Mood */}
              <Link
                href="/shop?q=vanilla"
                className="group p-6 rounded-3xl bg-white border border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10 transition-all text-center space-y-2.5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition-transform">
                  🧁
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-black group-hover:text-amber-800 transition-colors">
                  Cozy Bakery & Sweet
                </h3>
                <p className="text-xs text-stone-500">Bourbon Vanilla & Cinnamon</p>
                <span className="text-[11px] font-bold text-amber-700 underline block pt-1 group-hover:text-amber-900">
                  Explore Gourmand Scents →
                </span>
              </Link>

              {/* Temple Akhand Mood */}
              <Link
                href="/shop?category=pooja-temple-candles"
                className="group p-6 rounded-3xl bg-white border border-amber-200/90 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10 transition-all text-center space-y-2.5 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto text-2xl group-hover:scale-110 transition-transform">
                  🪔
                </div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-black group-hover:text-amber-800 transition-colors">
                  Devotional Temple Akhand
                </h3>
                <p className="text-xs text-stone-500">Brass Urli & Cow Ghee Wax</p>
                <span className="text-[11px] font-bold text-amber-700 underline block pt-1 group-hover:text-amber-900">
                  Explore Temple Candles →
                </span>
              </Link>
            </div>
          </div>

          {/* 3B. Featured Luxury Candle Collections */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-t border-amber-200/60 pt-10">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Artisanal Masterpieces</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black mt-1">
                  Featured Luxury Candle Collections
                </h2>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-stone-900 text-white font-medium text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>

            {/* Light-Themed Product Grid */}
            <ProductGrid products={featuredCandles} theme="light" />
          </div>
        </div>
      </section>

      {/* 4. FESTIVE GIFTING & BESPOKE HAMPERS — [DARK MODE: Royal Black & Gold] */}
      <section className="relative bg-[#0C0A09] py-16 sm:py-24 text-white overflow-hidden border-y border-amber-900/50 w-full max-w-full">
        {/* Background Golden Spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-3xl overflow-hidden bg-stone-900/90 border border-amber-500/40 p-8 sm:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-2 border border-amber-500/40">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  Festive Gifting & Celebrations
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                  Gift Pure Warmth & Divine Fragrance <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">
                    to Your Loved Ones
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl font-normal">
                  Every Vedika Divine gold-trimmed flower candle is hand-poured with pure botanical soy wax and paired with our signature gold-embossed presentation box, matching aesthetic matchsticks, and a personalized blessing card.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/shop"
                    className="px-8 py-3.5 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Order Luxury Gift Candles
                  </Link>
                  <span className="text-xs text-amber-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Free Premium Gift Box on Orders Above ₹999
                  </span>
                </div>
              </div>

              {/* Glowing Transparent Luxury Candle & Presentation Box Showcase Frame */}
              <div className="lg:col-span-5 flex justify-center items-center">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center p-2 group">
                  {/* Radiant Golden Ambient Glow behind transparent image */}
                  <div className="absolute inset-2 bg-radial from-amber-400/35 via-amber-200/15 to-transparent rounded-full blur-3xl pointer-events-none scale-100 group-hover:scale-110 transition-transform duration-700" />

                  {/* Elegant Golden Concentric Aura Rings */}
                  <div className="absolute inset-4 rounded-full border border-amber-400/25 pointer-events-none animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-10 rounded-full border border-amber-500/15 pointer-events-none" />

                  {/* The Transparent Flower Candle + Luxury Box Image */}
                  <img
                    src="/images/Luxury_Gold-Trimmed_Flower_Candle_Set-removebg-preview.png"
                    alt="Vedika Divine Gold-Trimmed Flower Candle & Presentation Box Set"
                    className="w-full h-full object-contain relative z-10 drop-shadow-[0_16px_36px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Luxury Floating Sparkle Badge */}
                  <div className="absolute -bottom-2 right-2 sm:bottom-2 sm:right-4 z-20 px-3.5 py-1.5 rounded-full bg-stone-950/95 backdrop-blur-md border border-amber-400/80 flex items-center gap-1.5 text-amber-300 text-[11px] font-bold shadow-xl">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Gold-Trimmed Edition</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIVINE VALUES & QUALITY GUARANTEE — [LIGHT MODE: Pure White, Marble & Gold] */}
      <DivineValues />

      {/* 6. BESTSELLERS & CUSTOMER FAVORITES — [DARK MODE: Obsidian Black & Gold] */}
      <section className="relative bg-[#0C0A09] text-white py-16 sm:py-24 border-b border-amber-900/50 overflow-hidden w-full max-w-full">
        {/* Golden Backlight Glows */}
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-radial from-amber-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Customer Favorites</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Most Loved <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">Bestsellers</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
                The top-rated aromatherapy candles that our customers keep ordering again and again.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-amber-400 text-amber-300 hover:text-black font-semibold text-xs border border-amber-400/40 hover:border-amber-400 transition-all duration-300 group shadow-md"
            >
              <span>Explore All Candles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dark-Themed Product Grid */}
          <ProductGrid products={bestSellers} theme="dark" />
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS & REAL EXPERIENCES — [LIGHT MODE: Pure White & Gold] */}
      <section className="relative bg-[#FFFDF9] py-16 sm:py-24 overflow-hidden w-full max-w-full">
        {/* Subtle Ambient Golden Pools */}
        <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-amber-100/35 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400 bg-white text-black text-xs font-semibold tracking-wider uppercase shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Real Customer Stories</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Loved in Over{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-amber-400 to-amber-700">
                15,000+ Homes
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto">
              Read how Vedika Divine brings serene joy, peace, and warmth to families across India.
            </p>
          </div>

          {/* Testimonial Cards (Pure White, Gold Stars & Black Badges) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all space-y-4 hover:-translate-y-1">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-normal">
                &quot;The Mysore Sandalwood candle is simply magical. The wooden wick crackles just like a gentle fireplace. Burns completely clean with zero black smoke on walls!&quot;
              </p>
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-black">Dr. Meera Iyer</p>
                  <p className="text-[10px] text-amber-700 font-semibold">Bengaluru • Verified Buyer</p>
                </div>
                <span className="text-xl">🪔</span>
              </div>
            </div>

            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all space-y-4 hover:-translate-y-1">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-normal">
                &quot;Ordered the Brass Urli Mogra candle for our housewarming puja. Guests could not stop complimenting the natural temple jasmine fragrance! Reordering 3 more.&quot;
              </p>
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-black">Rajesh & Shruti Mathur</p>
                  <p className="text-[10px] text-amber-700 font-semibold">Jaipur • Verified Buyer</p>
                </div>
                <span className="text-xl">✨</span>
              </div>
            </div>

            <div className="p-7 sm:p-8 bg-white rounded-3xl border border-amber-200/90 shadow-sm hover:shadow-xl hover:shadow-amber-900/10 hover:border-amber-400 transition-all space-y-4 hover:-translate-y-1">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-normal">
                &quot;The French Lavender candle has become an absolute bedtime ritual. Helps me unplug from work stress within 15 minutes. Pure soy wax quality is unmatched.&quot;
              </p>
              <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-black">Aditi Sen</p>
                  <p className="text-[10px] text-amber-700 font-semibold">Kolkata • Verified Buyer</p>
                </div>
                <span className="text-xl">🌙</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
