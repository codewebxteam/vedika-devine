"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Send,
  CheckCircle2,
  Globe,
  Clock,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { APP_CONFIG } from "@backend/index";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 1. Header (Dark Mode: Royal Black & Gold) */}
      <section className="relative bg-[#0C0A09] text-white py-14 sm:py-20 border-b border-amber-900/50 overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Customer & Dealer Support</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Contact <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">Vedika Devine</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            Questions regarding candle orders, custom corporate fragrances, or regional dealership? Our Kushinagar team is here to assist.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Company Details Box (Dark Glassmorphism Card) */}
          <div className="lg:col-span-5 bg-[#0C0A09] text-stone-200 rounded-3xl p-8 border border-amber-900/60 space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Official Registered Entity
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {APP_CONFIG.COMPANY_LEGAL_NAME}
              </h2>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">
                ({APP_CONFIG.ENTITY_TYPE})
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <p className="text-stone-300 leading-relaxed text-xs">
                  {APP_CONFIG.REGISTERED_ADDRESS}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400">Direct Telephone / Helpline</p>
                  <a href={`tel:${APP_CONFIG.PHONE_RAW}`} className="text-white hover:text-amber-300 font-bold text-sm">
                    +91 {APP_CONFIG.PHONE_RAW}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400">Official Correspondence</p>
                  <a href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`} className="text-white hover:text-amber-300 font-semibold text-xs">
                    {APP_CONFIG.SUPPORT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-stone-400">Factory Working Hours</p>
                  <p className="text-white font-medium text-xs">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-xs text-stone-400">
              <p className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pan-India Logistics Dispatch</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Direct dispatch via Delhivery, Blue Dart, and Indian Speed Post with tamper-proof fragile box packaging.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form (White Card with Gold Touches) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-black">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Fill in your contact details below and our team will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-black">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you for reaching out to Vedika Divine Home Industries. An executive from Kushinagar will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-full bg-black text-white text-xs font-semibold cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anjali Verma"
                      className="w-full p-3.5 rounded-xl border border-amber-300 text-black focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full p-3.5 rounded-xl border border-amber-300 text-black focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full p-3.5 rounded-xl border border-amber-300 text-black focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Message / Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help with your order, custom gifting, or dealership..."
                    className="w-full p-3.5 rounded-xl border border-amber-300 text-black focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer border border-black"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
