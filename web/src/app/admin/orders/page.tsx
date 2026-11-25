"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ShieldAlert,
  Store,
  Percent,
} from "lucide-react";
import {
  Order,
  OrderStatus,
  getAllOrders,
  calculateOrderDeadline,
  formatCurrency,
  formatDate,
} from "@backend/index";
import { OrderDetailsModal } from "@/components/admin/OrderDetailsModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sourceFilter, setSourceFilter] = useState<"all" | "direct" | "distributor">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statuses: ("All" | OrderStatus)[] = [
    "All",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const distributorOrdersCount = orders.filter((o) => o.orderType === "distributor_assisted").length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(search) ||
      o.shopName?.toLowerCase().includes(search.toLowerCase()) ||
      o.bookedByPartnerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.bookedByPartnerBusiness?.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || o.status === statusFilter;

    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "distributor" && o.orderType === "distributor_assisted") ||
      (sourceFilter === "direct" && o.orderType !== "distributor_assisted");

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Fulfillment & Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Customer Orders & Deadlines
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Compact order list • Real-time SLA delivery tracking • Click &ldquo;View More&rdquo; for complete customer info, packaging, and invoice slip.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => {
            const count =
              status === "All"
                ? orders.length
                : orders.filter((o) => o.status === status).length;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950/60"
                    : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Channel / Order Source Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-800/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mr-1">
            Channel:
          </span>
          <button
            onClick={() => setSourceFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              sourceFilter === "all"
                ? "bg-stone-100 text-stone-950 font-bold"
                : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
            }`}
          >
            All Channels ({orders.length})
          </button>
          <button
            onClick={() => setSourceFilter("direct")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              sourceFilter === "direct"
                ? "bg-stone-100 text-stone-950 font-bold"
                : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
            }`}
          >
            Direct Customers ({orders.length - distributorOrdersCount})
          </button>
          <button
            onClick={() => setSourceFilter("distributor")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              sourceFilter === "distributor"
                ? "bg-amber-500 text-stone-950 font-bold"
                : "bg-stone-900 text-amber-400 hover:text-amber-300 border border-amber-800/80"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Distributor Retail Booked ({distributorOrdersCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, City, Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Compact Orders Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order # & Onboard Date</th>
                <th className="py-3.5 px-4">Customer & City</th>
                <th className="py-3.5 px-4">Order Value</th>
                <th className="py-3.5 px-4">Delivery Deadline (Real SLA)</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No orders match your current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const deadline = calculateOrderDeadline(
                    order.createdAt,
                    order.status,
                    10
                  );

                  return (
                    <tr
                      key={order.id || order.orderNumber}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Order # and Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-white text-xs block group-hover:text-amber-400 transition-colors">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-stone-500 mt-0.5 block">
                          Onboarded: {deadline.onboardFormatted}
                        </span>
                      </td>

                      {/* Customer / Target Shop */}
                      <td className="py-3.5 px-4">
                        {order.orderType === "distributor_assisted" ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 font-bold text-[10px] border border-amber-800 flex items-center gap-1">
                                <Store className="w-3 h-3 text-amber-400" />
                                <span>{order.shopName || order.shippingAddress?.fullName}</span>
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-300 truncate">
                              Owner: <strong>{order.shopOwnerName || order.shippingAddress?.fullName}</strong> ({order.shippingAddress?.city})
                            </p>
                            <p className="text-[10px] text-amber-400 font-semibold truncate">
                              🤝 Dist: {order.bookedByPartnerBusiness || order.bookedByPartnerName}
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-white text-xs truncate max-w-[180px]">
                              {order.shippingAddress?.fullName || "Valued Customer"}
                            </p>
                            <p className="text-[10px] text-stone-400 truncate mt-0.5">
                              {order.shippingAddress?.city}, {order.shippingAddress?.state}
                            </p>
                          </>
                        )}
                      </td>

                      {/* Amount & Commission */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-serif font-bold text-amber-400 text-sm block">
                          {formatCurrency(order.total)}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {order.items?.length || 0} items • {order.paymentMethod === "Cash on Delivery" ? "COD" : "Online"}
                        </span>
                        {order.orderType === "distributor_assisted" && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Dist. Comm: {order.partnerCommissionRate || 10}% (₹{order.partnerCommissionAmount || 0})
                          </span>
                        )}
                      </td>

                      {/* Deadline Countdown & Urgent Flag */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${deadline.badgeColorClass}`}
                          >
                            {deadline.badgeText}
                          </span>
                          <span className="block text-[10px] text-stone-500">
                            Target: {deadline.targetFormatted}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            order.status === "Delivered"
                              ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                              : order.status === "Shipped"
                              ? "bg-blue-950 text-blue-300 border-blue-800"
                              : order.status === "Processing"
                              ? "bg-amber-950 text-amber-300 border-amber-800"
                              : order.status === "Cancelled"
                              ? "bg-stone-800 text-stone-400 border-stone-700"
                              : "bg-stone-800 text-stone-200 border-stone-700"
                          }`}
                        >
                          {order.status || "Confirmed"}
                        </span>
                      </td>

                      {/* View More Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View More</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for View More */}
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
    </div>
  );
}
