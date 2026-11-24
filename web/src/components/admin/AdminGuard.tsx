"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Building2,
  Store,
  LogOut,
  Flame,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user, profile, isAdmin, isDealer, loading, logout } = useAuth();

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
            Verifying Admin Access Rights...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Not logged in at all
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4 py-12 text-stone-100">
        <div className="max-w-md w-full bg-stone-900 rounded-3xl border border-stone-800 p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Security Barrier
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Admin Authentication Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              This URL is protected and restricted to authorized management personnel of <strong>M/S RMPG Vedika Divine Home Industries</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/auth/login?redirect=/admin"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60"
            >
              Sign In to Admin Account
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-2xl border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-medium transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated, but NOT an Admin (Customer, Dealer, or Pending Dealer)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4 py-12 text-stone-100">
        <div className="max-w-lg w-full bg-stone-900 rounded-3xl border border-rose-900/60 p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
              Access Denied (403 Unauthorized)
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">
              Admin Privileges Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed mt-2">
              You are signed in as <strong className="text-stone-200">{user.email}</strong>, but your role is{" "}
              <span className="font-mono text-amber-300 font-bold bg-stone-950 px-2 py-0.5 rounded-lg border border-stone-800">
                &ldquo;{profile?.role || "customer"}&rdquo;
              </span>
              . You cannot access the Store Management Console with this account.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-left text-xs text-stone-400 space-y-2">
            <p className="font-semibold text-stone-300">Where would you like to go?</p>
            <div className="flex flex-col gap-2 pt-1">
              {isDealer ? (
                <Link
                  href="/dealer/dashboard"
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Go to your Wholesale Dealer Dashboard →</span>
                </Link>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
                >
                  <Store className="w-4 h-4" />
                  <span>Go to Customer Retail Storefront →</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={async () => {
                await logout();
                router.push("/auth/login?redirect=/admin");
              }}
              className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Account</span>
            </button>
            <Link
              href="/"
              className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin: render children
  return <>{children}</>;
};
