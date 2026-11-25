"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(email, password, name);
      router.push("/");
    } catch (err: any) {
      console.warn("Registration attempt failed:", err.code || err.message);
      setError(
        err.code === "auth/email-already-in-use"
          ? "This email is already registered. Please sign in instead."
          : err.message || "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
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
                New Customer
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Create Account
              </h1>
            </div>
            <p className="text-xs text-stone-500">
              Join the Vedika Divine Candles family to unlock member discounts, order tracking & fast checkout.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full pl-10 pr-3.5 py-3 rounded-2xl border border-amber-200 bg-amber-50/20 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-3 focus:ring-amber-500/15 transition-all"
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

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
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Password (Min 6 Characters)
              </label>
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

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          {/* Member perks */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs space-y-1.5">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Member Privileges Included:</span>
            </p>
            <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
              <li>Instant 10% discount coupon on your first retail purchase</li>
              <li>Early access to seasonal candle collection launches</li>
              <li>Saved delivery addresses for 1-click checkout</li>
            </ul>
          </div>

          <div className="text-center pt-1">
            <p className="text-xs text-stone-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-amber-800 hover:text-orange-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
