"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  createOrder,
  formatCurrency,
  APP_CONFIG,
  PaymentMethod,
  PAYMENT_METHODS,
} from "@backend/index";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  const [fullName, setFullName] = useState(profile?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [street, setStreet] = useState(profile?.addresses?.[0]?.street || "");
  const [city, setCity] = useState(profile?.addresses?.[0]?.city || "");
  const [stateName, setStateName] = useState(profile?.addresses?.[0]?.state || "Uttar Pradesh");
  const [pincode, setPincode] = useState(profile?.addresses?.[0]?.pincode || "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS.COD as PaymentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const shippingFee = subtotal >= APP_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : APP_CONFIG.SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-stone-800 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-stone-500 mb-6">
          Your sacred cart is currently empty. Please add items from our divine store.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 rounded-full bg-amber-600 text-white font-semibold text-xs"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) {
      setErrorMessage("Please fill all shipping details.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        price: i.price,
        quantity: i.quantity,
        image: i.product.thumbnail || i.product.images[0],
      }));

      const newOrder = await createOrder({
        userId: user ? user.uid : `guest-${Date.now()}`,
        userEmail: email || "devotee@vedikadivine.com",
        items: orderItems,
        subtotal,
        shippingFee,
        discount: 0,
        total: totalAmount,
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state: stateName,
          pincode,
        },
        paymentMethod,
        paymentStatus: paymentMethod === PAYMENT_METHODS.COD ? "Pending" : "Paid",
      });

      clearCart();
      router.push(`/order-success/${newOrder.id}`);
    } catch (err: any) {
      console.error("Order error:", err);
      setErrorMessage(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
          Sacred Fulfillment
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
          Complete Your Divine Order
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Provide your sanctified delivery address for pure and safe delivery.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-stone-900 border-b border-amber-100 pb-3">
              1. Delivery Address & Devotee Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Devotee Name"
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="devotee@example.com"
                className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Street Address / House No / Landmark *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="House no, Street name, Landmark near temple"
                className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  City / Town *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Varanasi, Delhi, Mumbai..."
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Uttar Pradesh, Maharashtra..."
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="221001"
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-lg text-black border-b border-amber-100 pb-3">
              2. Select Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-200 hover:bg-amber-50/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_METHODS.COD}
                  onChange={() => setPaymentMethod(PAYMENT_METHODS.COD as PaymentMethod)}
                  className="accent-amber-600"
                />
                <div>
                  <p className="text-xs font-bold text-stone-900">
                    {PAYMENT_METHODS.COD} (Cash On Delivery)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Pay securely in cash or UPI when your candle package arrives at your doorstep.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-200 hover:bg-amber-50/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === PAYMENT_METHODS.UPI}
                  onChange={() => setPaymentMethod(PAYMENT_METHODS.UPI as PaymentMethod)}
                  className="accent-amber-600"
                />
                <div>
                  <p className="text-xs font-bold text-stone-900">
                    {PAYMENT_METHODS.UPI} (GPay, PhonePe, Paytm, QR)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Instant zero-touch payment via any UPI app.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs space-y-5">
            <h2 className="font-serif font-bold text-lg text-stone-900 border-b border-amber-100 pb-3">
              Order Items ({items.length})
            </h2>

            <div className="divide-y divide-amber-100 max-h-72 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.productId} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={i.product.thumbnail || i.product.images[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover border border-amber-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 truncate">{i.product.name}</p>
                      <p className="text-[11px] text-stone-500">Qty: {i.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 font-serif">
                    {formatCurrency(i.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-amber-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-amber-200">
                <span>Total Payable</span>
                <span className="text-xl text-amber-800 font-serif">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-full bg-black hover:bg-stone-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-black"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>
                {isSubmitting ? "Placing Candle Order..." : "Confirm & Place Candle Order"}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 py-2.5 rounded-2xl border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fragile-Safe Box Packaging & Fast Courier Guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
