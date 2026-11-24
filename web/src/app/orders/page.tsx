"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Eye,
  Search,
  Filter,
  AlertCircle,
  Copy,
  Check,
  Ban,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Order,
  OrderStatus,
  getUserOrders,
  formatCurrency,
  formatDate,
  cancelUserOrder,
} from "@backend/index";
import { OrderTrackingModal } from "@/components/orders/OrderTrackingModal";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserOrders(user.uid);
      setOrders(data);
    } catch (e) {
      console.warn("Could not load user orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancel = async (order: Order) => {
    if (!order.id) return;
    const confirmCancel = confirm(
      `Are you sure you want to cancel order #${order.orderNumber}?`
    );
    if (!confirmCancel) return;

    const reason = prompt("Please provide a reason for cancellation (optional):", "Changed mind");
    try {
      await cancelUserOrder(order.id, reason || "Cancelled by user");
      await fetchOrders();
    } catch (err: any) {
      alert("Failed to cancel order: " + err.message);
    }
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="py-28 text-center space-y-4 bg-[#FFFDF9] min-h-screen">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif text-sm font-semibold text-black">
          Loading your candle orders...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-amber-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-black">
            Track Your Candle Orders
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Please sign in to view your past and active orders, courier tracking updates, and invoices.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-block w-full py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-transform hover:scale-102"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statuses = ["All", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesSearch =
      search === "" ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase())) ||
      o.shippingAddress?.fullName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF9] w-full max-w-full overflow-x-hidden">
      {/* Luxury Orders Header */}
      <section className="relative bg-[#0C0A09] text-white py-12 sm:py-16 border-b border-amber-900/50 overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Purchase History & Tracking</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              My Candle Orders & Tracking
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Review current delivery statuses, consignment tracking, and past order details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-400/50 text-amber-300 hover:bg-amber-950/40 text-xs font-semibold transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Quick Consignment Search</span>
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs shadow-md hover:bg-amber-100 transition-all"
            >
              <span>Order More Candles</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((st) => {
              const count =
                st === "All"
                  ? orders.length
                  : orders.filter((o) => o.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-black text-amber-400 shadow-sm"
                      : "bg-white border border-stone-200 text-stone-600 hover:bg-amber-50"
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order # or Candle name..."
              className="w-full pl-9 pr-3.5 py-2 rounded-full border border-amber-300 bg-white text-xs text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center space-y-4 shadow-sm">
            <Package className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-black">
              {search ? "No matching candle orders found" : "No orders found for this status"}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {search
                ? "Try searching with a different order number or keyword."
                : "You do not have any orders matching the selected filter."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, orderIdx) => {
              const status = order.status || "Confirmed";
              const isDelivered = status === "Delivered";
              const isShipped = status === "Shipped";
              const isCancelled = status === "Cancelled";
              const canCancel = (status === "Confirmed" || status === "Pending");
              const orderKey = order.id || order.orderNumber || String(orderIdx);

              // Calculate progress percentage
              let progressPercent = 20;
              if (status === "Processing") progressPercent = 45;
              if (status === "Shipped") progressPercent = 75;
              if (status === "Delivered") progressPercent = 100;
              if (isCancelled) progressPercent = 0;

              return (
                <div
                  key={orderKey}
                  className="bg-white rounded-3xl border border-amber-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Order Top Bar */}
                  <div className="bg-amber-50/60 p-5 sm:p-6 border-b border-amber-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-black uppercase">
                          Order #{order.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(order.orderNumber, orderKey)}
                          className="text-[10px] text-amber-800 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                          title="Copy Order ID"
                        >
                          {copiedId === orderKey ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <span
                          className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : isShipped
                              ? "bg-amber-100 text-amber-900 border border-amber-400"
                              : isCancelled
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-black text-amber-400"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-700" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span>•</span>
                        <span>Payment: {order.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                        Total Amount
                      </p>
                      <p className="font-serif font-bold text-xl text-black">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Visual Stepper Bar on the Card */}
                  {!isCancelled && (
                    <div className="px-5 sm:px-6 py-4 bg-[#FFFDF9] border-b border-amber-100/70">
                      <div className="flex justify-between items-center text-[11px] font-semibold text-stone-600 mb-2">
                        <span className={progressPercent >= 20 ? "text-amber-950 font-bold" : ""}>
                          1. Placed
                        </span>
                        <span className={progressPercent >= 45 ? "text-amber-950 font-bold" : ""}>
                          2. Handcrafted
                        </span>
                        <span className={progressPercent >= 75 ? "text-amber-950 font-bold" : ""}>
                          3. Dispatched
                        </span>
                        <span className={progressPercent >= 100 ? "text-emerald-700 font-bold" : ""}>
                          4. Delivered
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Courier info strip if available */}
                  {(order.courierPartner || order.trackingNumber) && !isCancelled && (
                    <div className="px-5 sm:px-6 py-3 bg-stone-900 text-white flex flex-wrap justify-between items-center gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Carrier: <strong>{order.courierPartner || "Standard Express"}</strong>
                          {order.trackingNumber && (
                            <span className="font-mono ml-2 text-amber-300">
                              (AWB: {order.trackingNumber})
                            </span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedTrackingOrder(order)}
                        className="text-amber-400 font-bold text-xs hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>View Live Map & Milestones →</span>
                      </button>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="p-5 sm:p-6 divide-y divide-amber-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 p-1 shrink-0 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt="" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-amber-700">
                                <Flame className="w-5 h-5 fill-amber-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-sm text-black line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-stone-500">
                              Qty: <strong className="text-black">{item.quantity}</strong> × {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-serif font-bold text-sm text-black">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Bar: Delivery Address & Actions */}
                  <div className="bg-[#FFFDF9] p-4 sm:p-5 border-t border-amber-100 flex flex-wrap justify-between items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 text-stone-600 font-normal">
                      <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        Shipping to: <strong>{order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city}, {order.shippingAddress?.pincode})
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Track Shipment Button */}
                      <button
                        onClick={() => setSelectedTrackingOrder(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Package</span>
                      </button>

                      {/* View Invoice */}
                      <Link
                        href={`/order-success/${order.id || order.orderNumber}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black hover:bg-stone-900 text-white font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Receipt</span>
                      </Link>

                      {/* Cancel Button if eligible */}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer transition-colors"
                          title="Cancel Order"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Live Order Tracking Modal */}
      {selectedTrackingOrder && (
        <OrderTrackingModal
          order={selectedTrackingOrder}
          onClose={() => setSelectedTrackingOrder(null)}
        />
      )}
    </div>
  );
}
