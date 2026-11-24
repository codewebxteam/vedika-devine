"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Clock,
  Lock,
  Phone,
  ShieldAlert,
  Store,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const DealerGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user, profile, isDealer, isDealerPending, isAdmin, loading, logout } =
    useAuth();

  // 1. Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
            Verifying Dealer Partner Session...
          </p>
        </div>
      </div>
    );
  }

  // 2. Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4 py-12 text-stone-100">
        <div className="max-w-md w-full bg-stone-900 rounded-3xl border border-stone-800 p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Wholesale Partner Portal
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Dealer Authentication Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              This dashboard is strictly protected for verified wholesale partners of <strong>M/S RMPG Vedika Divine Home Industries</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/dealer/login"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60"
            >
              Sign In to Dealer Account
            </Link>
            <Link
              href="/dealer/register"
              className="w-full py-2.5 rounded-2xl bg-stone-950 border border-amber-800/80 hover:bg-stone-800 text-amber-300 text-xs font-semibold transition-colors"
            >
              Apply to Become a Partner 🤝
            </Link>
            <Link
              href="/"
              className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors pt-1"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Logged in, but application is PENDING APPROVAL
  if (isDealerPending || profile?.dealerInfo?.status === "pending") {
    const businessName =
      profile?.dealerInfo?.businessName || profile?.displayName || "Partner";

    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border border-amber-800/80 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider">
              ⏳ Application Under Review
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Partner Approval Pending
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Aapka application <strong>M/S RMPG Vedika Divine Home Industries</strong> ke management ke paas review ke liye pending hai.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs text-stone-400 space-y-2">
            <p className="font-bold text-stone-200">Business: {businessName}</p>
            <p>Email: {user.email}</p>
            <p className="text-[11px] text-amber-400/90 pt-1 border-t border-stone-800">
              Admin ke approve karte hi aapka yahi login credentials activate ho jayega aur aap wholesale rates dekh payenge.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={`https://wa.me/918874205655?text=${encodeURIComponent(
                `Namaste Admin, I have submitted a dealer application for ${businessName} (${user.email}). Please approve my dealer account.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/60"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Admin on WhatsApp (+91 8874205655)</span>
            </a>

            <button
              onClick={async () => {
                await logout();
                router.push("/dealer/login");
              }}
              className="w-full py-2.5 rounded-2xl border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Logged in, but role is CUSTOMER (Not a dealer)
  if (!isDealer && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4 py-12 text-stone-100">
        <div className="max-w-md w-full bg-stone-900 rounded-3xl border border-amber-800/60 p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              Wholesale Partner Access Only
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Dealer Privilege Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed mt-2">
              You are signed in as <strong className="text-stone-200">{user.email}</strong> with a standard retail customer account. Wholesale master carton rates require an approved dealer partner status.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/dealer/register"
              className="w-full py-3 rounded-2xl bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60"
            >
              Apply to Become a Partner 🤝
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-2xl border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-medium transition-colors"
            >
              Continue to Retail Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 5. Authorized Dealer / Admin: Render protected dashboard
  return <>{children}</>;
};
