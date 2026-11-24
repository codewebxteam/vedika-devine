"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Building2,
  PackageCheck,
  Crown,
  LogOut,
  Flame,
  Sparkles,
  Truck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Category, CATEGORIES, getCategories, APP_CONFIG } from "@backend/index";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, isDealer, logout } = useAuth();
  const { totalItems, setIsCartDrawerOpen } = useCart();

  const [categories, setCategories] = useState<Category[]>([...CATEGORIES]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getCategories().then((cats) => {
      if (cats && cats.length > 0) setCategories(cats);
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop", hasDropdown: true },
    { name: "About", href: "/about" },
    { name: "Wholesale", href: "/wholesale" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-amber-100/60 transition-all w-full">
      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-40">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left: Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-amber-800 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Left: Brand Identity Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src="/images/logo.png"
              alt="Vedika Devine Logo"
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-stone-900 group-hover:text-amber-700 transition-colors leading-none">
                Vedika Devine
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.28em] font-semibold text-amber-700 uppercase mt-0.5">
                LIGHT UP GOOD VIBES
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links (matches reference design) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-stone-700">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative z-50"
                    onMouseEnter={() => setShopDropdownOpen(true)}
                    onMouseLeave={() => setShopDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                      className={`flex items-center gap-1.5 py-2 transition-colors hover:text-amber-700 cursor-pointer ${isActive
                        ? "text-stone-900 font-bold"
                        : "text-stone-700"
                        }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 transition-transform ${shopDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Shop Categories Mega Dropdown */}
                    {shopDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.22)] border border-amber-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-1.5 border-b border-amber-50">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            Candle Varieties
                          </span>
                        </div>
                        <Link
                          href="/shop"
                          onClick={() => setShopDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50"
                        >
                          ✨ View All Collections
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setShopDropdownOpen(false)}
                            className="block px-4 py-2 text-xs text-stone-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                        <div className="pt-2 border-t border-amber-50 px-4">
                          <Link
                            href="/wholesale"
                            onClick={() => setShopDropdownOpen(false)}
                            className="text-[11px] font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
                          >
                            <Building2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Wholesale Dealer Cartons →</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative py-2 transition-colors hover:text-amber-700 ${isActive
                    ? "text-stone-900 font-bold"
                    : "text-stone-700"
                    }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions (Search, User, Cart with Golden badge) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon / Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-stone-700 hover:text-amber-700 hover:bg-amber-50/60 transition-colors"
                title="Search Candles"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Popover Search Bar */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search soy candles, aromas..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
                    />
                    <Search className="w-4 h-4 text-amber-700 absolute left-3 top-2.5" />
                  </form>
                </div>
              )}
            </div>

            {/* User Account Icon & Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-2 rounded-full text-stone-700 hover:text-amber-700 hover:bg-amber-50/60 transition-colors cursor-pointer"
                title="Account"
                aria-label="User Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {userDropdownOpen && (
                <>
                  {/* Invisible backdrop to dismiss dropdown on click outside */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.22)] border border-amber-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 text-xs"
                  >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-amber-50">
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                          Signed In As ({profile?.role || "customer"})
                        </p>
                        <p className="font-bold text-stone-900 truncate mt-0.5">
                          {profile?.displayName || user.email}
                        </p>
                      </div>

                      <Link
                        href="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <PackageCheck className="w-4 h-4 text-amber-600" />
                        <span>My Candle Orders</span>
                      </Link>

                      <Link
                        href="/track-order"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Truck className="w-4 h-4 text-amber-600" />
                        <span>Track Consignment</span>
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <UserIcon className="w-4 h-4 text-amber-600" />
                        <span>Account & Addresses</span>
                      </Link>

                      {isDealer && (
                        <Link
                          href="/dealer/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 font-bold text-amber-900 bg-amber-50/80 hover:bg-amber-100"
                        >
                          <Building2 className="w-4 h-4 text-amber-600" />
                          <span>Dealer Partner Portal</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 font-bold text-amber-900 bg-amber-50/80 hover:bg-amber-100 border-t border-amber-100"
                        >
                          <Crown className="w-4 h-4 text-amber-600 fill-amber-400" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <button
                        onClick={async () => {
                          await logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left border-t border-amber-50 mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-amber-50">
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                          Vedika Devine Account
                        </p>
                      </div>
                      <Link
                        href="/auth/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 font-bold text-stone-800 hover:bg-amber-50 hover:text-amber-800"
                      >
                        Customer Login
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-stone-600 hover:bg-amber-50 hover:text-stone-900"
                      >
                        New Customer Registration
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100 border-t border-amber-100 mt-1"
                      >
                        <Truck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Track Order Consignment</span>
                      </Link>
                      <div className="border-t border-amber-50 my-1 pt-1">
                        <Link
                          href="/dealer/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 font-bold text-amber-800 hover:bg-amber-50"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Dealer Partner Login</span>
                        </Link>
                        <Link
                          href="/dealer/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-1.5 text-[11px] text-stone-500 hover:text-amber-700"
                        >
                          Apply to Become a Partner →
                        </Link>
                      </div>
                      <div className="border-t border-amber-50 pt-1">
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-stone-500 hover:text-stone-900"
                        >
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                          <span>Admin Portal</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
                </>
              )}
            </div>

            {/* Shopping Bag Icon with Golden Count Badge (matches mockup) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 text-stone-700 hover:text-amber-700 transition-transform active:scale-95"
              title="Shopping Cart"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-stone-800" />
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* User Requested: Ultra-Thin Black Marquee Strip with Auto Right-to-Left Infinite Rotation */}
      <div className="bg-black text-stone-200 border-y border-amber-950/60 h-7 sm:h-7.5 overflow-hidden flex items-center select-none shadow-xs w-full relative z-10">
        <div className="animate-marquee-infinite flex items-center text-[10px] sm:text-[11px] font-medium tracking-wide">
          {/* Loop Segment 1 */}
          <div className="flex items-center gap-6 px-4 shrink-0">
            <span className="flex items-center gap-1.5 text-stone-200">
              <span className="text-amber-400">✨</span>
              <span>अपने घर के हर पावन अवसर और खुशियों में रोशनी घोलें —</span>
              <strong className="text-amber-300 font-bold tracking-wider">वेदिका डिवाइन</strong>
              <span className="text-white font-medium">100% शुद्ध सोया वैक्स मोमबत्तियां</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <span>🔥 50+ घंटे अखंड धुआं-रहित सुगंधित प्रकाश</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <span>🌸 100% Zero Paraffin • Organic Soy Wax Handcrafted Luxury</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-amber-200">
              <span>🪔 कुशीनगर मैन्युफैक्चरिंग यूनिट से सीधे आपके द्वार</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-white">
              <span>📦 थोक एवं रिटेल डीलर्स के लिए मास्टर कार्टन उपलब्ध • हेल्पलाइन: 8874205655</span>
            </span>
            <span className="text-amber-500/80">•</span>
          </div>

          {/* Loop Segment 2 (Duplicate for Seamless Infinite Scroll) */}
          <div className="flex items-center gap-6 px-4 shrink-0" aria-hidden="true">
            <span className="flex items-center gap-1.5 text-stone-200">
              <span className="text-amber-400">✨</span>
              <span>अपने घर के हर पावन अवसर और खुशियों में रोशनी घोलें —</span>
              <strong className="text-amber-300 font-bold tracking-wider">वेदिका डिवाइन</strong>
              <span className="text-white font-medium">100% शुद्ध सोया वैक्स मोमबत्तियां</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <span>🔥 50+ घंटे अखंड धुआं-रहित सुगंधित प्रकाश</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <span>🌸 100% Zero Paraffin • Organic Soy Wax Handcrafted Luxury</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-amber-200">
              <span>🪔 कुशीनगर मैन्युफैक्चरिंग यूनिट से सीधे आपके द्वार</span>
            </span>
            <span className="text-amber-500/80">•</span>
            <span className="flex items-center gap-1.5 text-white">
              <span>📦 थोक एवं रिटेल डीलर्स के लिए मास्टर कार्टन उपलब्ध • हेल्पलाइन: 8874205655</span>
            </span>
            <span className="text-amber-500/80">•</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-amber-200/80 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 text-xs">
          <div className="space-y-1 pb-3 border-b border-amber-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-semibold text-stone-800 hover:text-amber-800"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-1 flex flex-col gap-2">
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-stone-800 font-bold flex items-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Track My Order</span>
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-stone-700 font-medium flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4 text-amber-600" />
              <span>My Account & Addresses</span>
            </Link>
            <Link
              href="/wholesale"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-amber-800 font-bold flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Wholesale & Dealer Portal</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-stone-600 font-medium flex items-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
