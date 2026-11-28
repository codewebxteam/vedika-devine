"use client";

import React from "react";
import { APP_CONFIG } from "@backend/index";

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const SOCIAL_CHANNELS = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@vedikadivine_official",
    url: APP_CONFIG.SOCIAL_LINKS.INSTAGRAM,
    icon: InstagramIcon,
    colorClass: "hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10",
    gradientClass: "from-purple-600 via-pink-600 to-amber-500",
    description: "Follow for divine reels, pooja aesthetics, customer reviews & festive updates",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "Vedika Divine Official",
    url: APP_CONFIG.SOCIAL_LINKS.FACEBOOK,
    icon: FacebookIcon,
    colorClass: "hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10",
    gradientClass: "from-blue-600 to-indigo-700",
    description: "Join our official community for product launches & wholesale updates",
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@vedikadivine_official",
    url: APP_CONFIG.SOCIAL_LINKS.YOUTUBE,
    icon: YouTubeIcon,
    colorClass: "hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10",
    gradientClass: "from-red-600 to-rose-700",
    description: "Watch artisan wax pouring, fragrance notes & behind-the-scenes",
  },
];

interface SocialLinksProps {
  variant?: "footer" | "contact" | "header" | "pills";
  className?: string;
  showLabels?: boolean;
}

export const SocialLinksGroup: React.FC<SocialLinksProps> = ({
  variant = "footer",
  className = "",
  showLabels = false,
}) => {
  if (variant === "header") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {SOCIAL_CHANNELS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Vedika Divine on ${item.name}`}
              title={`${item.name}: ${item.handle}`}
              className="p-1.5 rounded-full text-amber-200/90 hover:text-white hover:bg-amber-500/20 transition-all hover:scale-110"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 ${className}`}>
        {SOCIAL_CHANNELS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 hover:border-amber-400 hover:bg-stone-800 transition-all group flex flex-col justify-between space-y-3 shadow-md hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-950 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:text-white group-hover:border-amber-300 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Follow
                </span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-sm group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] text-amber-300/80 font-mono truncate mt-0.5">
                  {item.handle}
                </p>
                <p className="text-[10px] text-stone-400 line-clamp-2 mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    );
  }

  // Default "footer" variant
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {SOCIAL_CHANNELS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow Vedika Divine on ${item.name}`}
            title={`${item.name} (${item.handle})`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900/90 border border-amber-500/30 text-stone-300 hover:text-white hover:border-amber-400 transition-all shadow-md group hover:scale-105"
          >
            <div className="text-amber-400 group-hover:scale-110 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
            {showLabels && (
              <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-300">
                {item.name}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
};
