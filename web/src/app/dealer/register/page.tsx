"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { APP_CONFIG } from "@backend/index";

export default function DealerRegisterPage() {
  const { registerDealer } = useAuth();

  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    email: "",
    password: "",
    city: "",
    state: "Uttar Pradesh",
    gstNumber: "",
    estimatedMonthlyVolume: "20-50 Master Cartons",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await registerDealer(formData);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(
        err.message?.includes("email-already-in-use")
          ? "This email is already registered. Please login or use a different email."
          : err.message || "Failed to submit dealer application."
      );
    }
    setLoading(false);
  };

  // SUCCESS SCREEN
  if (isSubmitted) {
    const whatsappUrl = `https://wa.me/918874205655?text=${encodeURIComponent(
      `Namaste Admin, I have submitted my dealer application on Vedika Divine for '${formData.businessName}' (${formData.contactPerson}, Phone: ${formData.phone}). Please review and approve my dealer account.`
    )}`;

    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 py-12">
        <div className="max-w-lg w-full bg-stone-900 border border-amber-800/80 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider">
              Application Under Review
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Application Submitted Successfully!
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
              Aapka wholesale dealer partner application <strong>M/S RMPG Vedika Divine Home Industries</strong> ke management ke paas review ke liye submit ho chuka hai.
            </p>
          </div>

          {/* Important instructions box */}
          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/80 text-left text-xs text-stone-300 space-y-3">
            <p className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Aapke Login Credentials:</span>
            </p>
            <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5 font-mono text-[11px]">
              <p>
                <span className="text-stone-500">Email (User ID):</span>{" "}
                <strong className="text-amber-300">{formData.email}</strong>
              </p>
              <p>
                <span className="text-stone-500">Password:</span>{" "}
                <span className="text-stone-400">•••••••• (Aapka chosen password)</span>
              </p>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              👉 <strong>Admin ke approve karte hi</strong> aapka yahi email aur password aapka active <strong>Dealer Login Credentials</strong> ban jayega, jisse aap website ke <strong>Footer &gt; Dealer Login</strong> se kabhi bhi wholesale dealer portal me login kar payenge!
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/60"
            >
              <Phone className="w-4 h-4" />
              <span>Notify Admin on WhatsApp (+91 8874205655)</span>
            </a>

            <Link
              href="/dealer/login"
              className="w-full py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              Go to Dealer Login Page
            </Link>

            <Link
              href="/"
              className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3 px-4">
        <img
          src="/images/logo.png"
          alt="Vedika Divine Logo"
          className="h-16 w-auto object-contain mx-auto drop-shadow-md"
        />
        <div>
          <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
            Become an Authorized Partner
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-0.5">
            Wholesale Dealer Registration
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
            Direct factory carton pricing, high retail margins, and bulk supply from Kushinagar manufacturing unit.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Business Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>1. Business & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    Shop / Firm / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="e.g. Shri Krishna Candle & Gift House"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    Owner / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="e.g. Gorakhpur, Lucknow, Patna..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Uttar Pradesh"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, gstNumber: e.target.value })
                    }
                    placeholder="e.g. 09ABCDE1234F1Z5"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500 font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    Monthly Expected Volume
                  </label>
                  <select
                    value={formData.estimatedMonthlyVolume}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedMonthlyVolume: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500 text-xs"
                  >
                    <option value="10-25 Master Cartons">10 - 25 Master Cartons</option>
                    <option value="25-50 Master Cartons">25 - 50 Master Cartons</option>
                    <option value="50-100 Master Cartons">50 - 100 Master Cartons</option>
                    <option value="100+ Master Cartons">100+ Master Cartons (Distributor)</option>
                    <option value="Festive & Wedding Bulk Gifting">Festive & Wedding Bulk Gifting</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Login Credentials Section */}
            <div className="space-y-3 pt-3 border-t border-stone-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>2. Create Dealer Login Credentials</span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Isi email aur password se aap approval milne ke baad Dealer Login kar sakenge.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    Dealer Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="dealer@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                    Choose Password (Min 6 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>{loading ? "Submitting Application..." : "Submit Partner Application"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800 text-center">
            <p className="text-xs text-stone-400">
              Already submitted or have an approved dealer account?{" "}
              <Link
                href="/dealer/login"
                className="text-amber-400 hover:text-amber-300 font-bold"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
