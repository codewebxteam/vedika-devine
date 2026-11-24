"use client";

import React, { useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, X, Flame } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row antialiased selection:bg-amber-600 selection:text-white">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 sticky top-0 z-50">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Vedika Divine Logo"
              className="h-8 w-auto object-contain rounded-lg bg-white/10 p-0.5 shrink-0"
            />
            <div>
              <span className="font-serif font-bold text-xs tracking-wider text-white">VEDIKA ADMIN</span>
              <span className="block text-[9px] text-amber-400 font-semibold tracking-wider uppercase">RMPG Industries</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-300 hover:text-white bg-stone-800 border border-stone-700/60"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xs top-[53px]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-stone-900 w-72 h-full border-r border-stone-800 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Desktop Sidebar (Sticky left) */}
        <div className="hidden md:block shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-stone-800/80">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 min-h-screen overflow-y-auto bg-stone-950">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
