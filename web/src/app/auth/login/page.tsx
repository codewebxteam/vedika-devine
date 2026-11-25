"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Gift,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resetPassword } from "@backend/index";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
              Customer Account
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2.5 tracking-wide">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
              Sign in to track orders, access saved addresses, and enjoy member-only candle rewards.
            </p>
          </div>
        </div>

        {/* Error / Reset Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5 text-left animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 text-left animate-in fade-in">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Password reset instructions sent to your email.</span>
          </div>
        )}

        {/* Email Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-5 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 text-sm sm:text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
              >
                Forgot password?
              </button>
            </div>
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5 text-stone-950" />
                <span>Sign In to Account</span>
              </>
            )}
          </button>
        </form>

        {/* Customer Trust Strip */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800/80 text-xs text-stone-300">
          <div className="flex items-center gap-2 p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
            <Gift className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">Free Gift on ₹999+</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">100% Safe COD</span>
          </div>
        </div>

        {/* Signup & Return Links */}
        <div className="space-y-3 pt-2 border-t border-stone-800/80 text-xs sm:text-sm">
          <p className="text-stone-400">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-amber-400 hover:text-amber-300 hover:underline ml-1"
            >
              Register Here →
            </Link>
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
