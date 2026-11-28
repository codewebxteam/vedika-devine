"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Package,
  Building2,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Eye,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Boxes,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  getProducts,
  getAllOrders,
  getAllInquiries,
  getAllUsers,
  Product,
  Order,
  WholesaleInquiry,
  UserProfile,
  formatCurrency,
  formatDate,
  calculateOrderDeadline,
  clearAllDummyData,
  APP_CONFIG,
} from "@backend/index";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";
import { InquiryDetailsModal } from "@/components/admin/InquiryDetailsModal";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected for View More modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<WholesaleInquiry | null>(null);
  const [clearing, setClearing] = useState(false);
  const [alertBanner, setAlertBanner] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [o, p, inq, u] = await Promise.all([
        getAllOrders(),
        getProducts(),
        getAllInquiries(),
        getAllUsers(),
      ]);
      setOrders(o);
      setProducts(p);
      setInquiries(inq);
      setUsers(u);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
    setLoading(false);
  };

  const handleClearAllDummyData = async () => {
    if (
      !confirm(
        "Are you sure you want to permanently delete all dummy categories and products from database? This will give you a fresh, clean store ready for your genuine items."
      )
    )
      return;
    setClearing(true);
    try {
      const res = await clearAllDummyData();
      await fetchDashboardData();
      setAlertBanner(
        `Store Cleared Successfully! Removed ${res.categoriesCleared} categories & ${res.productsCleared} products. Ready for your genuine catalog!`
      );
      setTimeout(() => setAlertBanner(null), 5000);
    } catch (err: any) {
      setAlertBanner(`Error clearing store: ${err.message}`);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  );
  
  // Count urgent orders (deadline <= 3 days remaining)
  const urgentOrders = activeOrders.filter((o) => {
    const d = calculateOrderDeadline(o.createdAt, o.status, 10);
    return d.isUrgent || d.isOverdue;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Banner & Header */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>Sacred Pooja Samagri & Dealer Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              M/S RMPG VEDIKA DIVINE HOME INDUSTRIES
            </h1>
            <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
              Official Dealer Portal • Turkpatti Bazar, Post: Mahuawa Buzurg, District: Kushinagar, Uttar Pradesh – 274302 • Contact:{" "}
              <span className="text-amber-300 font-semibold">8874205655</span> •{" "}
              <span className="text-amber-300">vedikadivine@gmail.com</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleClearAllDummyData}
              disabled={loading || clearing}
              className="px-4 py-2.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 text-xs font-semibold flex items-center gap-2 border border-rose-800/60 transition-colors cursor-pointer disabled:opacity-50"
              title="Clear all dummy/sample categories and products to start fresh"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{clearing ? "Clearing..." : "Purge Dummy Data"}</span>
            </button>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-stone-700/60 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Sync Live Data</span>
            </button>
            <Link
              href="/admin/products"
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-950/60 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alert Banner for Store Operations */}
      {alertBanner && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{alertBanner}</span>
        </div>
      )}

      {/* 3-Step Management Workflow Hub (Pehle Category -> Fir Product -> Fir Inventory) */}
      <div className="bg-linear-to-r from-stone-900 via-stone-900 to-stone-950 p-5 sm:p-6 rounded-3xl border border-amber-900/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step-by-Step Store Operations (आसान 3-चरणीय सिंक प्रबंधन)</span>
            </span>
            <p className="text-xs text-stone-300 mt-0.5">
              Pehle श्रेणी (Categories) banayein ➔ Fir mombatti उत्पाद (Products) list karein ➔ Fir स्टॉक & कार्टन (Inventory) control karein.
            </p>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800 font-semibold shrink-0">
            ✓ ImageKit CDN & Real-time Sync Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Categories */}
          <div className="bg-stone-950/80 p-5 rounded-2xl border border-purple-900/40 hover:border-purple-500/60 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold uppercase tracking-wider">
                  चरण 1 • Categories
                </span>
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                1. श्रेणी बनाएं (Categories)
              </h3>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Nayi pooja samagri category banayein, ImageKit se cover photo upload karein, name aur icon dein.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link
                href="/admin/categories"
                className="w-full text-center py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-md"
              >
                + Manage Categories
              </Link>
            </div>
          </div>

          {/* Step 2: Add Product */}
          <div className="bg-stone-950/80 p-5 rounded-2xl border border-amber-900/40 hover:border-amber-500/60 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold uppercase tracking-wider">
                  चरण 2 • Add Products
                </span>
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition-colors">
                2. पूजा उत्पाद जोड़ें (Sacred Products)
              </h3>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Step 1 ki categories chun kar naye pooja products add karein, single jar & master carton rate bharein.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link
                href="/admin/products"
                className="w-full text-center py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors shadow-md"
              >
                + Add / Manage Products
              </Link>
            </div>
          </div>

          {/* Step 3: Inventory */}
          <div className="bg-stone-950/80 p-5 rounded-2xl border border-emerald-900/40 hover:border-emerald-500/60 transition-all flex flex-col justify-between space-y-3 group">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  चरण 3 • Live Inventory
                </span>
                <Boxes className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                3. स्टॉक और कार्टन नियंत्रण (Inventory)
              </h3>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Stock badhayein (+/-), Out-of-Stock toggle karein, ya edit button daba kar wapas add product me details update karein.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link
                href="/admin/inventory"
                className="w-full text-center py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition-colors shadow-md"
              >
                Open Stock Controller
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Sales */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Total Store Sales</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              From {orders.length} orders
            </p>
          </div>
        </div>

        {/* Customer Orders with Urgent Counter */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Active Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl font-bold text-white">
                {activeOrders.length}
              </h3>
              {urgentOrders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 animate-pulse">
                  🚨 {urgentOrders.length} Urgent
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {orders.length} total orders recorded
            </p>
          </div>
        </div>

        {/* Product Catalog */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Product Catalog</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              {products.length}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              Active product listings & cartons
            </p>
          </div>
        </div>

        {/* Wholesale Inquiries */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">Wholesale Leads</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-white">
              {inquiries.length}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              B2B bulk purchase inquiries
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders (with Deadline Calculation) & Wholesale Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Orders Table (8 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                <span>Customer Orders & Delivery Status</span>
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Compact view • Click &ldquo;View More&rdquo; for full dispatch details
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <Package className="w-8 h-8 mx-auto text-stone-600" />
              <p className="text-xs">No customer orders placed yet.</p>
              <p className="text-[11px] text-stone-600">
                Orders placed from the storefront will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {orders.slice(0, 6).map((order) => {
                const deadline = calculateOrderDeadline(
                  order.createdAt,
                  order.status,
                  10
                );

                return (
                  <div
                    key={order.id || order.orderNumber}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-800/40 px-3 rounded-2xl transition-colors group"
                  >
                    {/* Compact Order Details */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${deadline.badgeColorClass}`}
                        >
                          {deadline.badgeText}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 font-medium truncate">
                        {order.shippingAddress?.fullName || "Valued Customer"} •{" "}
                        <span className="text-stone-400">
                          {order.shippingAddress?.city || "India"}
                        </span>
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {order.items?.length || 0} items • {formatCurrency(order.total)} •{" "}
                        {order.paymentMethod || "COD"}
                      </p>
                    </div>

                    {/* View More Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View More</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Wholesale Inquiries List (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Wholesale Leads</span>
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Bulk buyer inquiries & cartons
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-stone-600" />
              <p className="text-xs">No wholesale inquiries yet.</p>
              <p className="text-[11px] text-stone-600">
                Bulk dealer leads from the wholesale portal will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {inquiries.slice(0, 5).map((inq) => {
                const receivedMs = inq.createdAt ? Number(inq.createdAt) : Date.now();
                const daysAgo = Math.max(
                  0,
                  Math.floor((Date.now() - receivedMs) / (24 * 60 * 60 * 1000))
                );
                const isUrgent = daysAgo >= 2;

                return (
                  <div
                    key={inq.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-stone-800/40 px-2 rounded-2xl transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white truncate">
                          {inq.businessName}
                        </span>
                        {isUrgent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-700">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {inq.contactPerson} • {inq.city}
                      </p>
                      <p className="text-[10px] text-amber-300 font-semibold">
                        📦 {inq.estimatedQuantity || "Bulk Deal"}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <Link
          href="/admin/products"
          className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 transition-all flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Product Catalog</p>
              <p className="text-[10px] text-stone-500">Add, edit items, specs, carton rates</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
        </Link>

        <Link
          href="/admin/categories"
          className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 transition-all flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Categories & Tags</p>
              <p className="text-[10px] text-stone-500">Create collections for storefront</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-purple-400 transition-colors" />
        </Link>

        <Link
          href="/admin/inventory"
          className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-emerald-600/50 transition-all flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Stock & Inventory</p>
              <p className="text-[10px] text-stone-500">Fast +/- stock & out-of-stock toggle</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
        </Link>

        <Link
          href="/"
          target="_blank"
          className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-600/50 transition-all flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Open Storefront</p>
              <p className="text-[10px] text-stone-500">View live customer experience</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
        </Link>
      </div>

      {/* Modals for View More */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={(orderId, newStatus) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId ? { ...o, status: newStatus } : o
              )
            );
          }}
        />
      )}

      {selectedInquiry && (
        <InquiryDetailsModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onDeleted={(id) => {
            setInquiries((prev) => prev.filter((i) => i.id !== id));
          }}
        />
      )}
    </div>
  );
}
