"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  Flame,
  AlertCircle,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { APP_CONFIG } from "@backend/index";

export default function DealerLoginPage() {
  const router = useRouter();
  const { login, profile, user, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingNotice(false);
    setLoading(true);

    try {
      await login(email, password);
      // Profile will update via AuthContext listener
    } catch (err: any) {
      setError(
        err.message?.includes("invalid-credential")
          ? "Invalid email or password. Please verify your dealer login details."
          : err.message || "Login failed. Please try again."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  // If already logged in, check role
  if (user && profile) {
    if (profile.role === "dealer") {
      router.push("/dealer/dashboard");
      return null;
    }

    if (profile.role === "dealer_pending") {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-stone-900 border border-amber-800/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                ⏳ Application Under Review
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Dealer Approval Pending
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                Aapka dealer partner application <strong>M/S RMPG Vedika Divine Home Industries</strong> ke paas verification ke liye submit hai.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs text-stone-400 space-y-2">
              <p className="font-bold text-stone-200">
                Business: {profile.dealerInfo?.businessName || profile.displayName}
              </p>
              <p>Email: {profile.email}</p>
              <p className="text-[11px] text-amber-400/90 pt-1 border-t border-stone-800">
                Jaise hi Admin approve karega, aapka yahi login credentials activate ho jayega aur aap seedhe wholesale dashboard me enter ho payenge.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <a
                href={`https://wa.me/918874205655?text=${encodeURIComponent(
                  `Namaste Admin, I have submitted dealer application for ${profile.dealerInfo?.businessName || profile.email}. Please approve my account.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Admin on WhatsApp</span>
              </a>

              <button
                onClick={logout}
                className="w-full py-2.5 rounded-2xl border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-semibold transition-colors"
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <img
          src="/images/logo.png"
          alt="Vedika Divine Logo"
          className="h-16 w-auto object-contain mx-auto drop-shadow-md"
        />
        <div>
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            B2B Wholesale Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-0.5">
            Dealer & Partner Login
          </h2>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            {APP_CONFIG.COMPANY_LEGAL_NAME} • Authorized Wholesale Dealer Hub
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Dealer Email ID *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dealer@business.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Authenticating Dealer..." : "Login to Dealer Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Become a Partner Callout */}
          <div className="pt-6 border-t border-stone-800 text-center space-y-3">
            <p className="text-xs text-stone-400">
              Don&apos;t have an approved dealer account?
            </p>
            <Link
              href="/dealer/register"
              className="w-full py-2.5 px-4 rounded-2xl bg-stone-950 border border-amber-800/80 hover:bg-stone-800 text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Apply to Become a Partner 🤝</span>
            </Link>
            <p className="text-[10px] text-stone-500">
              Submit your shop details. Once approved, use your chosen email & password to login anytime.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
            >
              ← Return to Retail Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
