"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  Layers,
  Boxes,
  Package,
  Building2,
  Users,
  Database,
  ArrowLeft,
  Crown,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { APP_CONFIG } from "@backend/index";

export const AdminSidebar: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  const links = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      name: "1. Categories (श्रेणी)",
      href: "/admin/categories",
      icon: <Layers className="w-4 h-4 text-purple-400" />,
    },
    {
      name: "2. Candle Products",
      href: "/admin/products",
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
    {
      name: "3. Inventory & Stock",
      href: "/admin/inventory",
      icon: <Boxes className="w-4 h-4 text-emerald-400" />,
    },
    {
      name: "Customer Orders",
      href: "/admin/orders",
      icon: <Package className="w-4 h-4" />,
    },
    {
      name: "Wholesale Inquiries",
      href: "/admin/inquiries",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      name: "Dealer Partners",
      href: "/admin/dealers",
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
    {
      name: "Users & Roles",
      href: "/admin/users",
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Database Seed",
      href: "/admin/seed",
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col justify-between border-r border-stone-800 min-h-screen p-5 shrink-0">
      <div className="space-y-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3 pb-5 border-b border-stone-800">
          <img
            src="/images/logo.png"
            alt="Vedika Divine Logo"
            className="h-10 w-auto object-contain rounded-xl bg-white/10 p-1 border border-stone-700/60 shrink-0"
          />
          <div>
            <h2 className="font-serif font-bold text-white text-sm tracking-wide">
              VEDIKA ADMIN
            </h2>
            <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
              RMPG Home Industries
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onNavigate?.()}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${isActive
                  ? "bg-amber-600 text-white shadow-md shadow-amber-900/40"
                  : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                  }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Card & Return to Store */}
      <div className="pt-6 border-t border-stone-800 space-y-3">
        <Link
          href="/"
          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </span>
          <ExternalLink className="w-3 h-3 text-stone-500" />
        </Link>

        {user && (
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <span className="truncate">{profile?.displayName || "Admin User"}</span>
              </p>
              <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
