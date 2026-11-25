"use client";

import React, { useState } from "react";
import {
  X,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  Printer,
  Calendar,
  ShieldAlert,
  Flame,
  Store,
  Percent,
  Coins,
} from "lucide-react";
import {
  Order,
  OrderStatus,
  calculateOrderDeadline,
  formatCurrency,
  updateOrderStatus,
  updateOrderTracking,
  updateOrderCommissionStatus,
  APP_CONFIG,
} from "@backend/index";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onStatusUpdated?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onStatusUpdated,
}) => {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(
    order?.status || "Confirmed"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  // Dispatch & Tracking States
  const [courierPartner, setCourierPartner] = useState(order?.courierPartner || "Delhivery Surface");
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "");
  const [trackingUrl, setTrackingUrl] = useState(order?.trackingUrl || "");
  const [dispatchNotes, setDispatchNotes] = useState(order?.dispatchNotes || "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(order?.estimatedDelivery || "");
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [trackingMsg, setTrackingMsg] = useState<string | null>(null);

  // Commission State for Distributor Assisted Orders
  const [commissionStatus, setCommissionStatus] = useState<
    "Pending" | "Approved" | "Paid" | "Cancelled"
  >(order?.commissionStatus || "Pending");
  const [commissionMsg, setCommissionMsg] = useState<string | null>(null);

  const handleCommissionStatusChange = async (
    newStatus: "Pending" | "Approved" | "Paid" | "Cancelled"
  ) => {
    if (!order || !order.id) return;
    try {
      await updateOrderCommissionStatus(order.id, newStatus);
      setCommissionStatus(newStatus);
      setCommissionMsg(`Distributor commission status updated to "${newStatus}"!`);
      setTimeout(() => setCommissionMsg(null), 3500);
    } catch (err: any) {
      alert(`Commission update failed: ${err.message}`);
    }
  };

  if (!order) return null;

  const deadline = calculateOrderDeadline(order.createdAt, currentStatus, 10);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order.id) return;
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      await updateOrderStatus(order.id, newStatus);
      setCurrentStatus(newStatus);
      onStatusUpdated?.(order.id, newStatus);
      setUpdateMsg(`Order status updated to "${newStatus}"!`);
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch (err: any) {
      setUpdateMsg(`Failed to update: ${err.message || "Error"}`);
    }
    setIsUpdating(false);
  };

  const handleSaveTracking = async () => {
    if (!order.id) return;
    setIsSavingTracking(true);
    setTrackingMsg(null);
    try {
      await updateOrderTracking(order.id, {
        courierPartner,
        trackingNumber: trackingNumber.trim(),
        trackingUrl: trackingUrl.trim(),
        dispatchNotes: dispatchNotes.trim(),
        estimatedDelivery: estimatedDelivery.trim(),
        status: currentStatus,
      });
      setTrackingMsg("Consignment tracking saved! Visible to customer immediately.");
      setTimeout(() => setTrackingMsg(null), 3500);
    } catch (err: any) {
      setTrackingMsg(`Failed to save: ${err.message || "Error"}`);
    } finally {
      setIsSavingTracking(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  // Progress percentage of SLA days
  const elapsedPercent = Math.min(
    100,
    Math.round((deadline.daysElapsed / deadline.totalSlaDays) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white tracking-wide">
                  {order.orderNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${deadline.badgeColorClass}`}
                >
                  {deadline.badgeText}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Onboarded on {deadline.onboardFormatted} • Total items:{" "}
                {order.items?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSlip}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="Print Dispatch Slip"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-stone-300">
          {/* Real-time Deadline & Delivery SLA Card */}
          <div
            className={`p-4.5 rounded-2xl border transition-all ${
              deadline.isUrgent
                ? "bg-red-950/40 border-red-700/80 shadow-lg shadow-red-950/50"
                : deadline.isOverdue
                ? "bg-rose-950/50 border-rose-700/90"
                : "bg-stone-950/80 border-stone-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    deadline.isUrgent
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : deadline.isOverdue
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  }`}
                >
                  {deadline.isUrgent || deadline.isOverdue ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Delivery SLA Timeline
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${deadline.badgeColorClass}`}
                    >
                      {deadline.badgeText}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {deadline.isUrgent ? (
                      <span className="text-red-300 font-semibold">
                        🚨 Urgent Action Required: Order is within 3 days of
                        target delivery deadline! Prioritize packaging and dispatch.
                      </span>
                    ) : deadline.isOverdue ? (
                      <span className="text-rose-400 font-semibold">
                        ⚠️ Overdue Warning: Target delivery date has passed. Please contact courier immediately.
                      </span>
                    ) : (
                      <span>
                        Fulfillment is on track. Standard 10-day dealer delivery schedule.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Status Update Quick Dropdown */}
              <div className="sm:text-right shrink-0">
                <label className="block text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1">
                  Update Status
                </label>
                <select
                  value={currentStatus}
                  disabled={isUpdating}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as OrderStatus)
                  }
                  className="bg-stone-900 border border-stone-700 text-stone-100 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-hidden focus:border-amber-500"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* SLA Progress Bar */}
            <div className="mt-4 pt-4 border-t border-stone-800/80 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-stone-400">
                  Onboarded:{" "}
                  <strong className="text-stone-200">
                    {deadline.onboardFormatted}
                  </strong>{" "}
                  ({deadline.daysElapsed} days elapsed)
                </span>
                <span className="text-stone-400">
                  Target Deadline:{" "}
                  <strong
                    className={
                      deadline.isUrgent
                        ? "text-red-400"
                        : deadline.isOverdue
                        ? "text-rose-400"
                        : "text-amber-300"
                    }
                  >
                    {deadline.targetFormatted}
                  </strong>{" "}
                  ({deadline.daysRemaining >= 0 ? `${deadline.daysRemaining} days remaining` : "Past deadline"})
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    deadline.isUrgent
                      ? "bg-red-500"
                      : deadline.isOverdue
                      ? "bg-rose-600"
                      : currentStatus === "Delivered"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${elapsedPercent}%` }}
                />
              </div>
            </div>
            {updateMsg && (
              <p className="text-[11px] text-amber-400 font-semibold mt-2.5">
                {updateMsg}
              </p>
            )}
          </div>

          {/* Consignment & Courier Dispatch Tracker (Admin Control) */}
          <div className="p-4.5 rounded-2xl bg-stone-950/90 border border-amber-500/30 space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                  Courier Consignment & Live Tracking Details
                </h4>
              </div>
              <span className="text-[10px] text-amber-400/90 font-medium">
                Changes appear on customer&apos;s tracker in real time
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-400 font-semibold mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="Blue Dart Express">Blue Dart Express</option>
                  <option value="DTDC Express">DTDC Express</option>
                  <option value="India Post Speed Post">India Post Speed Post</option>
                  <option value="XpressBees Logistics">XpressBees Logistics</option>
                  <option value="Shadowfax D2C">Shadowfax D2C</option>
                  <option value="In-House Kushinagar Delivery">In-House Kushinagar Delivery</option>
                  <option value="Other">Other Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">
                  AWB / Consignment Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 14285918231 or DLH109283"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white font-mono placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">
                  Online Tracking URL (Optional)
                </label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.courier.com/..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. Within 3-5 days (28 Nov)"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 font-semibold mb-1">
                Dispatch / Handling Notes
              </label>
              <input
                type="text"
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                placeholder="e.g. Fragile glass candles, bubble wrapped with moisture packets."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {trackingMsg ? (
                <span className="text-emerald-400 text-xs font-semibold">
                  ✓ {trackingMsg}
                </span>
              ) : (
                <span className="text-[11px] text-stone-500">
                  Click save to broadcast consignment AWB to user.
                </span>
              )}

              <button
                type="button"
                onClick={handleSaveTracking}
                disabled={isSavingTracking}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSavingTracking ? "Saving..." : "Save Dispatch & Tracking Info"}
              </button>
            </div>
          </div>

          {/* Distributor Assisted Order & Shop Destination (If applicable) */}
          {order.orderType === "distributor_assisted" && (
            <div className="p-5 rounded-2xl bg-amber-950/20 border-2 border-amber-500/40 space-y-3.5 shadow-lg shadow-black/40">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-amber-900/40">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-sm">
                      Distributor Retail Assisted Order (Field Dukan Booking)
                    </h4>
                    <p className="text-[10px] text-amber-300">
                      Booked by authorized field partner • Stock dispatch destination confirmed
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-750">
                  🤝 Distributor Order
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Target Retail Shop Info */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                  <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>Target Retail Shop (Dispatch To)</span>
                  </p>
                  <p className="font-serif font-bold text-white text-base">
                    {order.shopName || order.shippingAddress?.fullName}
                  </p>
                  <p className="text-stone-300 text-xs">
                    Shop Owner: <strong className="text-white">{order.shopOwnerName || order.shippingAddress?.fullName}</strong>
                  </p>
                  <p className="text-stone-400 text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>Phone: <strong className="text-stone-200">{order.shopPhone || order.shippingAddress?.phone}</strong></span>
                  </p>
                  <p className="text-stone-400 text-xs leading-relaxed pt-1 border-t border-stone-800/80">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="font-mono text-amber-300">{order.shippingAddress?.pincode}</span>
                  </p>
                </div>

                {/* Booking Distributor & Commission */}
                <div className="space-y-2 p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      <span>Booking Distributor Details</span>
                    </p>
                    <p className="font-serif font-bold text-white text-sm">
                      {order.bookedByPartnerBusiness || order.bookedByPartnerName}
                    </p>
                    <p className="text-stone-400 text-[11px]">
                      Partner ID: <span className="font-mono text-stone-300">{order.bookedByPartnerId}</span>
                    </p>
                    {order.bookedByPartnerPhone && (
                      <p className="text-stone-400 text-xs flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>{order.bookedByPartnerPhone}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2.5 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">
                        Commission ({order.partnerCommissionRate || 10}%)
                      </span>
                      <span className="font-serif font-bold text-amber-400 text-base">
                        ₹{order.partnerCommissionAmount || 0}
                      </span>
                    </div>

                    <div className="text-right">
                      <label className="text-[10px] text-stone-400 block font-semibold mb-1">
                        Commission Payout
                      </label>
                      <select
                        value={commissionStatus}
                        onChange={(e) => handleCommissionStatusChange(e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700 text-xs font-bold text-amber-300 focus:outline-hidden cursor-pointer"
                      >
                        <option value="Pending">Pending Approval</option>
                        <option value="Approved">Approved (Ready to Pay)</option>
                        <option value="Paid">Paid to Distributor</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {commissionMsg && (
                <p className="text-xs text-emerald-400 font-semibold">
                  ✓ {commissionMsg}
                </p>
              )}
            </div>
          )}

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Shipping & Delivery Address
              </h4>
              <div className="text-stone-300 text-xs space-y-1">
                <p className="font-bold text-white text-sm">
                  {order.shippingAddress?.fullName || "Valued Customer"}
                </p>
                <p className="text-stone-400 leading-relaxed">
                  {order.shippingAddress?.street}
                  {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}
                </p>
                <p className="text-stone-400">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                  <span className="font-mono text-amber-300 font-semibold">
                    {order.shippingAddress?.pincode}
                  </span>
                </p>
                <div className="pt-2 flex flex-col gap-1 border-t border-stone-800/60 mt-2">
                  <p className="flex items-center gap-2 text-stone-300">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>{order.shippingAddress?.phone || "N/A"}</span>
                  </p>
                  <p className="flex items-center gap-2 text-stone-300">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>{order.userEmail || "N/A"}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800/80 space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-300">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                Payment & Billing Details
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Payment Method</span>
                  <span className="font-semibold text-white">
                    {order.paymentMethod || "Cash on Delivery (COD)"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Payment Status</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      order.paymentStatus === "Paid"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                        : "bg-amber-950 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {order.paymentStatus || "Pending upon Delivery"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Items Subtotal</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(order.subtotal || order.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-800/60">
                  <span className="text-stone-400">Shipping / Handling</span>
                  <span className="font-semibold text-emerald-400">
                    {order.shippingFee ? formatCurrency(order.shippingFee) : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 font-bold">
                  <span className="text-white text-sm">Total Order Value</span>
                  <span className="text-base text-amber-400 font-serif">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Candle Items List */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-stone-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Candle Items in Order ({order.items?.length || 0})
            </h4>
            <div className="rounded-2xl border border-stone-800 overflow-hidden divide-y divide-stone-800">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-950/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80"}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-800 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white text-xs leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Qty: <strong className="text-amber-300">{item.quantity}</strong> × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif font-bold text-sm text-amber-400">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Firm Dispatch Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-stone-400 flex items-center justify-between">
            <div>
              <p className="text-amber-300 font-semibold">
                {APP_CONFIG.BRAND_NAME} • {APP_CONFIG.COMPANY_LEGAL_NAME}
              </p>
              <p className="text-[10px] text-stone-500">
                Turkpatti Bazar, Post: Mahuawa Buzurg, Kushinagar, UP - 274302 • Contact: 8874205655
              </p>
            </div>
            <button
              onClick={handlePrintSlip}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition-colors shrink-0"
            >
              Print Dispatch Note
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-900 border-t border-stone-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
