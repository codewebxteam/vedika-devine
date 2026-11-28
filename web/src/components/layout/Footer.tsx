"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  Truck,
  Sparkles,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  Heart,
  Award,
  User,
} from "lucide-react";
import { Category, CATEGORIES, getCategories, APP_CONFIG } from "@backend/index";
import { SocialLinksGroup } from "@/components/common/SocialIcons";

export const Footer: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([...CATEGORIES]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });
  }, []);

  return (
    <footer
      suppressHydrationWarning
      className="relative bg-linear-to-b from-[#141210] via-[#0C0A09] to-[#050505] text-stone-200 pt-16 pb-20 sm:pb-12 border-t-2 border-amber-500/40 shadow-[0_-12px_40px_rgba(212,175,55,0.12)] mt-20 w-full max-w-full overflow-hidden"
    >
      {/* Opulent Ambient Golden Light Pools (Removes dull flat darkness) */}
      <div className="absolute top-0 left-1/4 w-[550px] h-[350px] bg-radial from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-radial from-amber-400/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[300px] bg-radial from-amber-700/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Floating Gold Sparkle Stars */}
      <div className="absolute top-8 left-[8%] text-amber-400/40 text-xl animate-pulse pointer-events-none">
        ✦
      </div>
      <div className="absolute top-16 right-[10%] text-amber-500/35 text-2xl animate-pulse pointer-events-none">
        ✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* 1. Quality & Trust Badges (Radiant Golden Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-amber-900/40">
          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-md hover:border-amber-400/70 hover:shadow-amber-950/40 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">100% Pure Soy Wax</h4>
              <p className="text-xs text-stone-300 mt-0.5">Zero toxic paraffin & non-smoking</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-md hover:border-amber-400/70 hover:shadow-amber-950/40 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform font-bold">
              <Flame className="w-6 h-6 fill-stone-950" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">50+ Hr Clean Burn</h4>
              <p className="text-xs text-stone-300 mt-0.5">Lead-free cotton & crackling wood</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-md hover:border-amber-400/70 hover:shadow-amber-950/40 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Factory Direct</h4>
              <p className="text-xs text-stone-300 mt-0.5">Kushinagar (UP) manufacturing</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-md hover:border-amber-400/70 hover:shadow-amber-950/40 transition-all flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">All-India Delivery</h4>
              <p className="text-xs text-stone-300 mt-0.5">Safe temperature-proof dispatch</p>
            </div>
          </div>
        </div>

        {/* 2. Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-10">
          {/* Brand Identity & High-Visibility Logo (Spans 4 columns) */}
          <div className="md:col-span-4 space-y-4">
            {/* Highly Visible Pristine Logo Card */}
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="p-2.5 rounded-2xl bg-white shadow-[0_4px_24px_rgba(212,175,55,0.4)] border-2 border-amber-400/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/images/logo.png"
                  alt="Vedika Divine Logo"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-amber-100 to-amber-400 leading-tight">
                  VEDIKA DIVINE
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold mt-0.5">
                  Light Up Good Vibes
                </span>
              </div>
            </Link>

            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 space-y-1">
              <p className="font-bold text-white text-xs">
                {APP_CONFIG.COMPANY_LEGAL_NAME}
              </p>
              <p className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Registered Partnership Firm ({APP_CONFIG.ENTITY_TYPE})</span>
              </p>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Crafting pure, sacred Pooja Samagri, 100% natural Bhimseni camphor, pure cow ghee diya batti, bamboo-less dhoop, 51-herb hawan samagri, and divine living fragrances.
            </p>

            {/* Social Media Channels */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                Connect With Us
              </span>
              <SocialLinksGroup variant="footer" showLabels={true} />
            </div>
          </div>

          {/* Column 2: Collections (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-serif font-bold text-amber-400 text-xs tracking-widest uppercase flex items-center gap-1.5 border-b border-amber-900/40 pb-2">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Collections</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-300">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="hover:text-amber-300 hover:translate-x-1 inline-flex items-center gap-1.5 transition-all"
                  >
                    <span className="text-amber-500/60 text-[10px]">›</span>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Portals & Quick Links (Spans 2 columns) */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-serif font-bold text-amber-400 text-xs tracking-widest uppercase flex items-center gap-1.5 border-b border-amber-900/40 pb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Access & Help</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <Link
                  href="/dealer/login"
                  className="hover:text-amber-300 text-amber-300 font-semibold flex items-center gap-1.5 hover:translate-x-1 transition-all"
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dealer / B2B Portal</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  scroll={true}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-amber-300 text-stone-200 font-medium flex items-center gap-1.5 hover:translate-x-1 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Console</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-amber-300 flex items-center gap-1.5 hover:translate-x-1 transition-all"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Track Consignment</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-amber-300 flex items-center gap-1.5 hover:translate-x-1 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Account & Addresses</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-amber-300 flex items-center gap-1.5 hover:translate-x-1 transition-all"
                >
                  <span className="text-amber-500/60 text-[10px]">›</span>
                  <span>Browse All Pooja Samagri</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-amber-300 flex items-center gap-1.5 hover:translate-x-1 transition-all"
                >
                  <span className="text-amber-500/60 text-[10px]">›</span>
                  <span>Shopping Cart</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Registered Office & Direct Helpline (Spans 4 columns) */}
          <div className="md:col-span-4 bg-stone-900/95 p-5 sm:p-6 rounded-3xl border border-amber-500/40 shadow-xl space-y-3.5">
            <h4 className="text-amber-300 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2 border-b border-stone-800 pb-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Registered Unit & Office</span>
            </h4>

            <div className="text-xs text-stone-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-stone-300 font-medium">
                  {APP_CONFIG.REGISTERED_ADDRESS}
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-stone-800">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block">Direct Order & Helpline:</span>
                  <a
                    href={`tel:${APP_CONFIG.PHONE_RAW}`}
                    className="hover:text-amber-300 transition-colors text-sm font-bold text-amber-300"
                  >
                    +91 {APP_CONFIG.PHONE_RAW}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-stone-800">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-stone-400 block">Official Email:</span>
                  <a
                    href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}
                    className="hover:text-amber-300 transition-colors text-xs text-stone-200 font-medium"
                  >
                    {APP_CONFIG.SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-stone-800">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs text-amber-300 font-semibold font-mono">
                  {APP_CONFIG.WEBSITE}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Dealer & Admin Access Action Banner */}
        <div className="py-6 px-6 sm:px-8 rounded-3xl bg-linear-to-r from-stone-900 via-amber-950/35 to-stone-900 border-2 border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="p-2 rounded-xl bg-white shadow-md border border-amber-400/80 shrink-0">
              <img
                src="/images/logo.png"
                alt="Vedika Divine Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-base">
                Authorized Dealer & Management Access
              </h4>
              <p className="text-xs text-stone-300 mt-0.5">
                Bulk B2B mombatti carton purchases or store management console
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/dealer/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <Building2 className="w-4 h-4 text-stone-950" />
              <span>Dealer Wholesale Login</span>
            </Link>

            <Link
              href="/admin"
              scroll={true}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 border border-amber-400/60 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>

        {/* 4. Bottom Copyright & Kushinagar Heritage Strip */}
        <div className="pt-6 border-t border-amber-900/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400 text-center sm:text-left">
          <p suppressHydrationWarning>
            © {mounted ? new Date().getFullYear() : "2026"}{" "}
            <strong className="text-amber-300 font-semibold">{APP_CONFIG.COMPANY_LEGAL_NAME}</strong>. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 font-medium">Follow Us:</span>
            <SocialLinksGroup variant="header" />
          </div>
          <p className="text-stone-300 text-xs flex items-center gap-1.5 font-medium">
            <span>Handcrafted with devotion in</span>
            <span className="text-amber-300 font-bold">Kushinagar, Uttar Pradesh, India</span>
            <span>🪔</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
