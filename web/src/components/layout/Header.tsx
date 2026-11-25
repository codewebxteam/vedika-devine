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
  ChevronRight,
  Building2,
  PackageCheck,
  Crown,
  LogOut,
  Flame,
  Sparkles,
  Truck,
  Heart,
  Phone,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Category, CATEGORIES, getCategories, APP_CONFIG } from "@backend/index";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/common/SocialIcons";

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-40">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Left: Mobile Hamburger & Brand Identity Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 -ml-1 text-stone-800 hover:text-amber-800 transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-stone-900" /> : <Menu className="w-5 h-5 text-stone-900" />}
            </button>

            <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <img
                src="/images/logo.png"
                alt="Vedika Divine Logo"
                className="h-9 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-xs shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-base sm:text-2xl font-bold tracking-wide sm:tracking-wider text-stone-900 group-hover:text-amber-700 transition-colors leading-tight truncate">
                  Vedika Divine
                </span>
                <span className="text-[7.5px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.28em] font-semibold text-amber-700 uppercase leading-none hidden sm:block">
                  LIGHT UP GOOD VIBES
                </span>
              </div>
            </Link>
          </div>

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

          {/* Right: Actions (Search, User, Cart with Golden badge - No clipping on mobile) */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Desktop Social Channels */}
            <div className="hidden lg:flex items-center gap-1.5 pr-2 border-r border-amber-200/70">
              <a
                href={APP_CONFIG.SOCIAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Vedika Divine on Instagram (@vedikadivine_official)"
                aria-label="Instagram"
                className="p-1.5 rounded-full text-stone-600 hover:text-pink-600 hover:bg-pink-50 transition-all hover:scale-110"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.SOCIAL_LINKS.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Vedika Divine on Facebook"
                aria-label="Facebook"
                className="p-1.5 rounded-full text-stone-600 hover:text-blue-600 hover:bg-blue-50 transition-all hover:scale-110"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={APP_CONFIG.SOCIAL_LINKS.YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                title="Subscribe to Vedika Divine on YouTube (@vedikadivine_official)"
                aria-label="YouTube"
                className="p-1.5 rounded-full text-stone-600 hover:text-red-600 hover:bg-red-50 transition-all hover:scale-110"
              >
                <YouTubeIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Search Icon / Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2 rounded-full text-stone-700 hover:text-amber-700 hover:bg-amber-50/60 transition-colors cursor-pointer"
                title="Search Candles"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Popover Search Bar */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-80 bg-white rounded-2xl shadow-2xl border border-amber-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
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
                className="p-1.5 sm:p-2 rounded-full text-stone-700 hover:text-amber-700 hover:bg-amber-50/60 transition-colors cursor-pointer"
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
                          Vedika Divine Account
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
              className="relative p-1.5 sm:p-2 text-stone-800 hover:text-amber-700 transition-transform active:scale-95 cursor-pointer shrink-0"
              title="Shopping Cart"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-stone-800" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Quick-Nav Options Strip: Ensures all store categories & sections are directly visible and accessible on phones */}
      <div className="md:hidden bg-amber-50/75 border-t border-amber-200/60 px-2.5 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-xs select-none shadow-inner">
        <Link
          href="/"
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
            pathname === "/"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-stone-700 hover:bg-amber-100 border border-amber-200/80"
          }`}
        >
          Home
        </Link>
        <Link
          href="/shop"
          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 ${
            pathname === "/shop" && !pathname.includes("category")
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white text-stone-700 hover:bg-amber-100 border border-amber-200/80"
          }`}
        >
          ✨ All Candles
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="px-3 py-1 rounded-full text-[11px] font-medium bg-white text-stone-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200/80 transition-colors shrink-0"
          >
            {cat.name}
          </Link>
        ))}
        <Link
          href="/wholesale"
          className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800/60 transition-colors shrink-0 flex items-center gap-1"
        >
          <Building2 className="w-3 h-3 text-amber-400" />
          <span>Wholesale</span>
        </Link>
        <Link
          href="/track-order"
          className="px-3 py-1 rounded-full text-[11px] font-medium bg-white text-stone-700 hover:bg-amber-100 border border-amber-200/80 transition-colors shrink-0 flex items-center gap-1"
        >
          <Truck className="w-3 h-3 text-amber-600" />
          <span>Track Order</span>
        </Link>
        <Link
          href="/about"
          className="px-3 py-1 rounded-full text-[11px] font-medium bg-white text-stone-700 hover:bg-amber-100 border border-amber-200/80 transition-colors shrink-0"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="px-3 py-1 rounded-full text-[11px] font-medium bg-white text-stone-700 hover:bg-amber-100 border border-amber-200/80 transition-colors shrink-0"
        >
          Contact
        </Link>
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
        <div className="md:hidden bg-[#FAF7F2] border-b border-amber-200/80 px-4 py-4 space-y-3.5 animate-in fade-in slide-in-from-top-2 text-xs max-h-[85vh] overflow-y-auto">
          {/* User Account / Welcome Card */}
          <div className="p-3 rounded-2xl bg-white border border-amber-200/90 shadow-xs flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-300">
                  {profile?.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                    Namaste
                  </p>
                  <p className="font-bold text-stone-900 truncate text-xs">
                    {profile?.displayName || user.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-xs">Namaste Guest</p>
                  <p className="text-[10px] text-stone-500">Sign in for exclusive member privileges</p>
                </div>
              </div>
            )}

            {user ? (
              <button
                onClick={async () => {
                  await logout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 shrink-0 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 text-[11px] font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs shrink-0"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Candle Varieties & Collections Accordion/List */}
          <div className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-amber-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Candle Varieties & Collections</span>
              </span>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] font-bold text-amber-700 hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-1 pt-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-1.5 px-2 rounded-xl text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <span className="text-xs font-medium">{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Core Store Navigation Links */}
          <div className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 px-2 rounded-xl text-stone-800 hover:bg-amber-50 font-semibold text-xs"
            >
              <span>🏠</span>
              <span>Home Store</span>
            </Link>
            <Link
              href="/wholesale"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 px-2 rounded-xl bg-amber-50/70 text-amber-950 font-bold text-xs border border-amber-200/60"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Wholesale & Bulk Cartons</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-amber-600 text-white rounded-full font-bold">
                B2B Rates
              </span>
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 px-2 rounded-xl text-stone-800 hover:bg-amber-50 font-semibold text-xs"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Track Consignment</span>
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 px-2 rounded-xl text-stone-800 hover:bg-amber-50 font-semibold text-xs"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>My Saved Wishlist</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartDrawerOpen(true);
              }}
              className="w-full flex items-center justify-between py-2 px-2 rounded-xl text-stone-800 hover:bg-amber-50 font-semibold text-xs cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                <span>Shopping Cart</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full border border-amber-300">
                {totalItems} items
              </span>
            </button>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 px-2 rounded-xl text-stone-800 hover:bg-amber-50 font-semibold text-xs"
            >
              <span>ℹ️</span>
              <span>About Kushinagar Heritage</span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 px-2 rounded-xl text-stone-800 hover:bg-amber-50 font-semibold text-xs"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Contact Us & Support</span>
            </Link>
          </div>

          {/* Portals: Dealer Partner & Admin */}
          <div className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 block">
              Official Portals
            </span>
            <Link
              href="/dealer/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-amber-900 hover:bg-amber-50 font-semibold text-xs"
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              <span>Dealer Partner Portal</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-stone-700 hover:bg-amber-50 font-semibold text-xs"
            >
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Admin Management</span>
            </Link>
          </div>

          {/* Helpline & Social Links */}
          <div className="p-3 bg-stone-900 text-stone-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-xs">📞 Helpline:</span>
                <a href="tel:8874205655" className="text-white font-bold text-xs hover:text-amber-300">
                  +91 8874205655
                </a>
              </div>
              <a
                href="https://wa.me/918874205655?text=Hello%20Vedika%20Divine,%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 flex items-center gap-1"
              >
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={APP_CONFIG.SOCIAL_LINKS.INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-pink-400 hover:bg-stone-700 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={APP_CONFIG.SOCIAL_LINKS.FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-blue-400 hover:bg-stone-700 transition-colors"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={APP_CONFIG.SOCIAL_LINKS.YOUTUBE}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-red-400 hover:bg-stone-700 transition-colors"
                >
                  <YouTubeIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
