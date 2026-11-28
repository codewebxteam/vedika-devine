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
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { APP_CONFIG, submitWholesaleInquiry } from "@backend/index";
import { SocialLinksGroup } from "@/components/common/SocialIcons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Pooja Samagri Order & Product Inquiry");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const targetPhone = "918874205655";
    const dateFormatted = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Beautifully formatted WhatsApp message with clean markdown & emojis
    const wpMessage =
`✨ *NEW INQUIRY — VEDIKA DIVINE SACRED POOJA SAMAGRI* ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${name.trim()}
📞 *Phone / WhatsApp:* ${phone.trim() || "Not provided"}
✉️ *Email Address:* ${email.trim() || "Not provided"}
🏷️ *Topic / Subject:* ${subject}

💬 *Message / Requirement:*
"${message.trim()}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *Source:* www.vedikadivine.com/contact
🕒 *Time:* ${dateFormatted}
🏭 *Support:* Kushinagar Central Factory, Uttar Pradesh`;

    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(wpMessage)}`;
    setWhatsappUrl(url);

    // Save as background inquiry in Firestore for Admin console records
    try {
      await submitWholesaleInquiry({
        businessName: name.trim(),
        contactPerson: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: "Contact Web Form",
        estimatedQuantity: subject,
        candleTypesNeeded: [subject],
        message: message.trim(),
      });
    } catch (err) {
      console.warn("Background inquiry logging error:", err);
    }

    setSubmitting(false);
    setSubmitted(true);

    // Open WhatsApp in a new tab/window immediately
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }
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
            Contact <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-amber-200 to-amber-500">Vedika Divine</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            Questions regarding sacred pooja samagri orders, custom gifting hampers, or regional dealership? Our Kushinagar team is here to assist.
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

            {/* Official Social Media Channels */}
            <div className="pt-4 border-t border-stone-800 space-y-2.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                Official Social Channels
              </span>
              <SocialLinksGroup variant="footer" showLabels={true} />
            </div>
          </div>

          {/* Contact Inquiry Form (White Card with WhatsApp Direct Integration) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-sm space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant WhatsApp Support Desk</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-black">
                Send Us an Inquiry
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Niche apni details bharein — click karte hi aapka inquiry message direct hamare official WhatsApp (<strong className="text-stone-800 font-mono">+91 8874205655</strong>) par formatted ready ho kar open ho jayega.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50/80 rounded-3xl border-2 border-emerald-500/40 space-y-4 animate-in fade-in zoom-in-95 shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold shadow-inner">
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    🎉 WhatsApp Message Ready!
                  </h3>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Aapka formatted inquiry message WhatsApp par generate ho chuka hai. Agar WhatsApp automatically open nahi hua, to niche diye button par click karein:
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-200 text-xs text-stone-700 max-w-md mx-auto text-left font-mono whitespace-pre-line bg-stone-50/80 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider mb-1 font-sans">
                    Message Preview:
                  </span>
                  &quot;{message.trim()}&quot;
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp Chat Directly</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-900 hover:bg-black text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-3.5 rounded-xl border border-stone-300 text-black focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full p-3.5 rounded-xl border border-stone-300 text-black focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full p-3.5 rounded-xl border border-stone-300 text-black focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Inquiry Topic / Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-stone-300 text-black focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                    >
                      <option value="Pooja Samagri Order & Product Inquiry">Pooja Samagri Order & Product Inquiry</option>
                      <option value="Wholesale Dealership / Distributor Inquiry">Wholesale Dealership / Distributor</option>
                      <option value="Corporate Gifting & Custom Fragrance">Corporate Gifting & Custom Fragrance</option>
                      <option value="Bulk Wedding & Event Favors">Bulk Wedding & Event Favors</option>
                      <option value="General Support Question">General Support Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Your Message / Requirement *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are looking for (e.g. need wholesale cartons of Bhimseni kapur, pure cow ghee diyas, or order query)..."
                    className="w-full p-3.5 rounded-xl border border-stone-300 text-black focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 bg-stone-50/50"
                  />
                </div>

                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-950/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-500 active:scale-98 disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                    <span>Send Inquiry on WhatsApp (व्हाट्सएप पर भेजें)</span>
                  </button>

                  <p className="text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                    <span>⚡ Instant Reply:</span>
                    <span>Click karte hi aapka message direct support number (+91 8874205655) par WhatsApp me open ho jayega.</span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 3. Official Social Channels Section */}
        <div className="mt-14 pt-12 border-t border-amber-200/80 space-y-6">
          <div className="text-center space-y-1.5 max-w-lg mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 block">
              Digital Community
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              Connect With Us Online
            </h3>
            <p className="text-xs text-stone-500">
              Watch live candle making reels, spiritual inspiration, and new collection launches on our verified channels.
            </p>
          </div>
          <SocialLinksGroup variant="contact" />
        </div>
      </div>
    </div>
  );
}
