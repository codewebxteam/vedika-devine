"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Building2,
  Store,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user, profile, isAdmin, isDealer, loading, logout, login } = useAuth();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Instant scroll-to-top so navigating from the footer never leaves the user at the bottom
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(adminEmail, adminPassword);
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/user-not-found"
          ? "Invalid admin email or password. Please verify your credentials."
          : err.message || "Authentication failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

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

  // 2. Unauthenticated: Full-Screen Dedicated Admin Login Page
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-stone-950 flex items-center justify-center px-4 py-12 relative overflow-hidden text-stone-100">
        {/* Ambient Luxury Golden Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-stone-900/95 rounded-3xl border border-amber-500/30 p-8 sm:p-10 text-center space-y-6 shadow-2xl backdrop-blur-md relative z-10 animate-in fade-in zoom-in-95">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-3">
            <img
              src="/images/logo.png"
              alt="Vedika Divine Logo"
              className="h-16 w-auto object-contain mx-auto drop-shadow-md"
            />
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-amber-950/90 text-amber-400 border border-amber-800/80">
                Official Admin Console
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                Store Management
              </h1>
              <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                Sign in with authorized administrator credentials to manage catalog, orders, and dealers.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 text-left animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@vedikadivine.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-stone-950" />
                  <span>Sign In to Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="pt-2 border-t border-stone-800/80">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Vedika Divine Storefront</span>
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
              You are signed in as <strong className="text-stone-200">{user.email}</strong>, but your account has the role{" "}
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
                  <span>Go to Wholesale Dealer Dashboard →</span>
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
              }}
              className="flex-1 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign In With Admin Account</span>
            </button>
            <Link
              href="/"
              className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60 flex items-center justify-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Admin: render full admin dashboard & children
  return <>{children}</>;
};
