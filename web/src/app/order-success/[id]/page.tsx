"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, ShieldCheck, MapPin, Truck } from "lucide-react";
import { Order, getOrderById, formatCurrency } from "@backend/index";

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    getOrderById(orderId).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500">Retrieving order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-10 shadow-xl text-center space-y-6">
        {/* Auspicious Check Circle */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full">
            Order Confirmed & Received
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black mt-3">
            Thank You! Your Candle Order is Placed
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            Thank you for shopping with Vedika Divine. Our Kushinagar unit has received your order and begun careful protective packaging for safe doorstep delivery.
          </p>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 text-left space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-amber-200/80 pb-3">
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                  Order Number
                </span>
                <span className="font-mono text-sm font-bold text-amber-950">
                  {order.orderNumber}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                  Estimated Delivery
                </span>
                <span className="text-xs font-bold text-stone-900">
                  {order.estimatedDelivery || "Within 3-5 business days"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                  Payment Mode
                </span>
                <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded inline-block mt-0.5">
                  {order.paymentMethod} (Pay upon arrival)
                </span>
              </div>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-2.5 text-xs text-stone-700">
              <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">
                  {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                </p>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="pt-3 border-t border-amber-200/80 divide-y divide-amber-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-amber-200"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{item.name}</p>
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold font-serif text-stone-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-amber-200/80 text-sm font-bold text-stone-900">
              <span>Total Paid / Payable</span>
              <span className="text-lg text-amber-800 font-serif">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/orders"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-102"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Track in My Orders</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-amber-300 hover:bg-amber-50 text-black font-semibold text-xs transition-colors"
          >
            Continue Browsing Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
