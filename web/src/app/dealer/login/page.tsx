"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Clock,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { APP_CONFIG } from "@backend/index";

export default function DealerLoginPage() {
  const router = useRouter();
  const { login, profile, user, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(
        err.message?.includes("invalid-credential") || err.message?.includes("user-not-found")
          ? "Invalid email or password. Please verify your dealer login details."
          : err.message || "Login failed. Please try again."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  // Redirect if already logged in as dealer or admin
  useEffect(() => {
    if (user && profile) {
      if (profile.role === "dealer" || profile.role === "admin") {
        router.push("/dealer/dashboard");
      }
    }
  }, [user, profile, router]);

  // If already logged in, check role
  if (user && profile) {
    if (profile.role === "dealer" || profile.role === "admin") {
      return (
        <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-300">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase font-bold tracking-widest text-stone-400">
              Redirecting to Dealer Dashboard...
            </p>
          </div>
        </div>
      );
    }

    if (profile.role === "dealer_pending") {
      return (
        <div className="min-h-screen bg-[#0C0A09] text-stone-100 flex items-center justify-center px-4 sm:px-6 py-8 relative overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-[450px] h-[450px] bg-radial from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />
          <div className="w-full max-w-[480px] sm:max-w-lg bg-[#141210]/95 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 text-center space-y-6 sm:space-y-7 shadow-[0_12px_60px_rgba(0,0,0,0.85)] relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider">
                ⏳ Application Under Review
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Dealer Approval Pending
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm mx-auto">
                Your wholesale dealer partner application is under verification with <strong>{APP_CONFIG.COMPANY_LEGAL_NAME}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs text-stone-300 space-y-2">
              <p className="font-bold text-stone-100">
                Business: {profile.dealerInfo?.businessName || profile.displayName}
              </p>
              <p>Email: {profile.email}</p>
              <p className="text-[11px] text-amber-400/90 pt-1.5 border-t border-stone-800">
                As soon as our administrative team approves your account, you will receive full access to master cartons, wholesale rates, and inventory.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <a
                href={`https://wa.me/91${APP_CONFIG.PHONE_RAW}?text=${encodeURIComponent(
                  `Namaste Admin, I have submitted dealer application for ${profile.dealerInfo?.businessName || profile.email}. Please approve my account.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Admin on WhatsApp</span>
              </a>

              <button
                onClick={logout}
                className="w-full py-3 rounded-2xl border border-stone-800 hover:bg-stone-900 text-stone-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0C0A09] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden text-stone-100">
      {/* Opulent Ambient Luxury Golden Glows */}
      <div className="absolute top-1/4 -left-10 w-[450px] h-[450px] bg-radial from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-[450px] h-[450px] bg-radial from-amber-600/15 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-[480px] sm:max-w-lg bg-[#141210]/95 rounded-3xl border-2 border-amber-500/40 p-6 sm:p-10 text-center space-y-6 sm:space-y-7 shadow-[0_12px_60px_rgba(0,0,0,0.85)] backdrop-blur-md relative z-10 animate-in fade-in zoom-in-95">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3.5">
          <div className="p-3 rounded-2xl bg-white/5 border border-amber-500/40 shadow-inner">
            <img
              src="/images/logo.png"
              alt="Vedika Divine Logo"
              className="h-20 sm:h-22 w-auto object-contain mx-auto drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]"
            />
          </div>
          <div>
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] uppercase font-bold tracking-widest bg-amber-950 text-amber-400 border border-amber-800">
              B2B Wholesale Portal
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2.5 tracking-wide">
              Dealer & Partner Login
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
              Authorized wholesale hub for regional distributors, retail shops, and bulk candle cartons.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 text-left animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              Dealer Email ID
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dealer@business.com"
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 text-sm sm:text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 text-sm sm:text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 sm:py-4.5 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Dealer...</span>
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5 text-stone-950" />
                <span>Login to Dealer Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Apply for Partnership Callout */}
        <div className="pt-4 border-t border-stone-800/80 space-y-3">
          <p className="text-xs text-stone-400">
            Don&apos;t have an approved wholesale dealer account?
          </p>
          <Link
            href="/dealer/register"
            className="w-full py-3.5 px-4 rounded-2xl bg-stone-950 border border-amber-600/80 hover:bg-stone-900 text-amber-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Apply to Become a Partner 🤝</span>
          </Link>
        </div>

        {/* Return to Storefront */}
        <div className="pt-2 border-t border-stone-800/80">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-stone-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Retail Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
