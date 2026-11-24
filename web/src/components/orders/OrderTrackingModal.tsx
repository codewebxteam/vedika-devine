"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Flame,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Order, OrderStatus, formatCurrency, formatDate } from "@backend/index";

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const status = order.status || "Confirmed";
  const isCancelled = status === "Cancelled";

  // Milestones progression logic
  const getStepState = (stepIndex: number) => {
    if (isCancelled) return { completed: false, current: false };

    let currentIdx = 0;
    if (status === "Confirmed") currentIdx = 0;
    else if (status === "Processing") currentIdx = 1;
    else if (status === "Shipped") currentIdx = 2;
    else if (status === "Delivered") currentIdx = 4;

    if (stepIndex < currentIdx) return { completed: true, current: false };
    if (stepIndex === currentIdx) return { completed: false, current: true };
    return { completed: false, current: false };
  };

  const steps = [
    {
      title: "Order Placed & Confirmed",
      subtitle: "वेदिका डिवाइन द्वारा ऑर्डर स्वीकृत",
      desc: "Artisanal order registered. Materials allocated in Kushinagar atelier.",
      time: formatDate(order.createdAt),
      ...getStepState(0),
    },
    {
      title: "Handcrafted & Quality Inspection",
      subtitle: "शुद्ध सोया वैक्स व सुगंध सम्मिश्रण",
      desc: "Soy wax hand-poured, natural cotton wick secured, gold foil gift packaging.",
      time: order.status === "Confirmed" ? "In Progress" : "Completed",
      ...getStepState(1),
    },
    {
      title: "Dispatched via Courier",
      subtitle: "सुरक्षित पार्सल कूरियर को सौंपा गया",
      desc: order.courierPartner
        ? `Handed over to ${order.courierPartner}. Secure transit bubble box.`
        : "Courier consignment generated with tamper-proof packaging.",
      time: order.dispatchedAt ? formatDate(order.dispatchedAt) : (order.status === "Shipped" || order.status === "Delivered" ? "Dispatched" : "Upcoming"),
      ...getStepState(2),
    },
    {
      title: "Out for Doorstep Delivery",
      subtitle: "डिलीवरी एजेंट आपके पते के लिए रवाना",
      desc: "Package arrived at your local hub and is assigned to local delivery partner.",
      time: order.status === "Delivered" ? "Completed" : "Awaiting local arrival",
      ...getStepState(3),
    },
    {
      title: "Delivered to Customer",
      subtitle: "सफलतापूर्वक सुपुर्द",
      desc: "Safely received. May the divine fragrance illuminate your home.",
      time: order.deliveredAt ? formatDate(order.deliveredAt) : (order.estimatedDelivery || "Expected in 3-5 days"),
      ...getStepState(4),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl border border-amber-300 w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0C0A09] text-white p-5 sm:p-6 border-b border-amber-900/50 flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[250px] h-[250px] bg-radial from-amber-500/20 via-transparent to-transparent blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-amber-400" />
                Live Consignment Tracker
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Order #{order.orderNumber}
            </h2>
            <p className="text-xs text-stone-300">
              Placed on {formatDate(order.createdAt)} • {order.items.length} candle items
            </p>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-9 h-9 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-stone-800">
          {/* Status Alert Banner */}
          {isCancelled ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3 text-rose-900">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Order Cancelled</p>
                <p className="text-xs mt-0.5 text-rose-700">
                  {order.cancelReason || "This order was cancelled. Any online payment will be refunded to source within 3-5 business days."}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-50 to-white border border-amber-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center shrink-0 shadow-md">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
                    Current Consignment Status
                  </span>
                  <span className="font-serif text-base font-bold text-black flex items-center gap-2">
                    {order.status}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
                  Estimated Delivery
                </span>
                <span className="font-bold text-amber-900 text-xs">
                  {order.estimatedDelivery || "Within 3-5 business days"}
                </span>
              </div>
            </div>
          )}

          {/* Courier Partner & AWB Details */}
          {(order.courierPartner || order.trackingNumber) && (
            <div className="p-4.5 rounded-2xl bg-stone-900 text-white border border-amber-500/30 space-y-3 shadow-lg">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold block">
                    Courier Partner
                  </span>
                  <p className="font-serif text-sm font-bold text-white">
                    {order.courierPartner || "Standard Express Logistics"}
                  </p>
                </div>

                {order.trackingNumber && (
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                      AWB / Tracking Number
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {order.trackingNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(order.trackingNumber!)}
                        className="px-2 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy Tracking #"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {order.trackingUrl && (
                <div className="pt-2 border-t border-stone-800 flex justify-end">
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition-all"
                  >
                    <span>Track on Official Courier Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Stepper Timeline */}
          {!isCancelled && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Handcrafting & Dispatch Journey</span>
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-amber-200">
                {steps.map((step, idx) => {
                  return (
                    <div key={idx} className="relative flex items-start gap-3 sm:gap-4 group">
                      {/* Step Circle Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          step.completed
                            ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                            : step.current
                            ? "bg-amber-500 text-black ring-4 ring-amber-200 animate-pulse"
                            : "bg-white border-2 border-stone-300 text-stone-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 space-y-0.5">
                        <div className="flex flex-wrap justify-between items-center gap-1">
                          <p
                            className={`font-serif text-xs sm:text-sm font-bold ${
                              step.completed || step.current ? "text-black" : "text-stone-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900/80 font-medium">
                          {step.subtitle}
                        </p>
                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Address & Packaging Assurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-amber-100">
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-700" />
                Shipping Destination
              </span>
              <p className="font-bold text-xs text-black">
                {order.shippingAddress?.fullName} (+91 {order.shippingAddress?.phone})
              </p>
              <p className="text-[11px] text-stone-600 leading-snug">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Packaging & Fragile Care
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                All Vedika Devine candles are encased in heavy-duty thermocol & air-bubble cushioning to guarantee zero melted wax or cracked glass in transit.
              </p>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="space-y-2 pt-2 border-t border-amber-100">
            <h4 className="font-serif font-bold text-xs text-black uppercase tracking-wider">
              Package Contents ({order.items.length} items)
            </h4>
            <div className="divide-y divide-amber-100 max-h-40 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-700">
                          <Flame className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-black line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-stone-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Strip */}
          <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-amber-200 flex flex-wrap justify-between items-center gap-2 text-[11px] text-stone-600">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>Need help with delivery? WhatsApp Support: <strong>+91 9129598282</strong></span>
            </span>
            <Link
              href="/contact"
              className="text-amber-800 font-bold hover:underline"
            >
              Contact Support →
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-amber-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
