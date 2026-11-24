"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const StoreLayoutShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // When navigating to admin or any new route, reset scroll to top instantly
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // If on admin route, isolate completely: no storefront header, footer, cart drawer, or mobile nav
  if (isAdminRoute) {
    return (
      <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col">
        {children}
      </div>
    );
  }

  // Normal storefront layout
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 sm:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
};
