"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck, Gift } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resetPassword } from "@backend/index";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/user-not-found"
          ? "Invalid email or password. Please verify your credentials."
          : err.message || "Failed to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first to reset password.");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-linear-to-b from-amber-50/40 via-white to-amber-50/20">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-amber-200/90 p-8 sm:p-10 shadow-xl shadow-amber-900/5 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <img
              src="/images/logo.png"
              alt="Vedika Divine Logo"
              className="h-16 w-auto object-contain mx-auto drop-shadow-md"
            />
            <div>
              <span className="text-[10px] tracking-[0.25em] font-bold text-amber-700 uppercase">
                Customer Account
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Welcome Back
              </h1>
            </div>
            <p className="text-xs text-stone-500">
              Sign in to track orders, access your sacred wishlist, and enjoy member-only candle rewards.
            </p>
          </div>

          {/* Error / Reset Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resetSent && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Password reset instructions sent to your email.</span>
            </div>
          )}

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-amber-200 bg-amber-50/20 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-3 focus:ring-amber-500/15 transition-all"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-amber-200 bg-amber-50/20 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-3 focus:ring-amber-500/15 transition-all"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 border border-black hover:scale-102"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Customer Trust Strip */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-100/80 text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 p-2 bg-amber-50/50 rounded-xl">
              <Gift className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Free Gift on ₹999+</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-amber-50/50 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>100% Secure Checkout</span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-stone-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/auth/register"
                className="font-bold text-amber-800 hover:text-orange-700 hover:underline"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
