"use client";

import React from "react";
import Link from "next/link";
import { Flame, PhoneCall, Mail, Gift, Globe } from "lucide-react";
import { APP_CONFIG } from "@backend/index";
import { SocialLinksGroup } from "@/components/common/SocialIcons";

export const TopAnnouncement: React.FC = () => {
  return (
    <div className="bg-stone-900 text-amber-100 text-xs py-2 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>
            ✨ <strong>M/S RMPG Vedika Divine:</strong> Handcrafted 100% Pure Soy Candles | Free Delivery above {APP_CONFIG.CURRENCY}{APP_CONFIG.FREE_SHIPPING_THRESHOLD}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-amber-200">
          <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-stone-700">
            <SocialLinksGroup variant="header" />
          </div>
          <a
            href={`mailto:${APP_CONFIG.SUPPORT_EMAIL}`}
            className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
          >
            <Mail className="w-3 h-3 text-amber-400" />
            {APP_CONFIG.SUPPORT_EMAIL}
          </a>
          <a
            href={`tel:${APP_CONFIG.PHONE_RAW}`}
            className="hover:text-amber-100 flex items-center gap-1 font-bold text-amber-300 transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            +91 {APP_CONFIG.PHONE_RAW}
          </a>
        </div>
      </div>
    </div>
  );
};
