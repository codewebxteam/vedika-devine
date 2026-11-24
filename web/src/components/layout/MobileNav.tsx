"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { wishlistIds } = useWishlist();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 py-2 px-3 flex justify-around items-center shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center text-[10px] ${
          pathname === "/" ? "text-amber-700 font-bold" : "text-stone-600"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        href="/shop"
        className={`flex flex-col items-center text-[10px] ${
          pathname.startsWith("/shop") ? "text-amber-700 font-bold" : "text-stone-600"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Shop</span>
      </Link>

      <Link
        href="/wishlist"
        className={`flex flex-col items-center text-[10px] relative ${
          pathname === "/wishlist" ? "text-amber-700 font-bold" : "text-stone-600"
        }`}
      >
        <Heart className="w-5 h-5" />
        {wishlistIds.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            {wishlistIds.length}
          </span>
        )}
        <span>Wishlist</span>
      </Link>

      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className="flex flex-col items-center text-[10px] text-stone-600 relative cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
        <span>Cart</span>
      </button>

      <Link
        href="/profile"
        className={`flex flex-col items-center text-[10px] ${
          pathname.startsWith("/profile") || pathname.startsWith("/auth")
            ? "text-amber-700 font-bold"
            : "text-stone-600"
        }`}
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </nav>
  );
};
