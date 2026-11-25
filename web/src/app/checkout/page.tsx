"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Banknote,
  AlertCircle,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  createOrder,
  formatCurrency,
  APP_CONFIG,
  PAYMENT_METHODS,
  PaymentMethod,
} from "@backend/index";

const INDIAN_STATES = [
  "Uttar Pradesh",
  "Bihar",
  "Delhi",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "West Bengal",
  "Haryana",
  "Punjab",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "Kerala",
  "Andhra Pradesh",
  "Odisha",
  "Jharkhand",
  "Assam",
  "Chhattisgarh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Goa",
  "Jammu and Kashmir",
  "Other",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState(profile?.displayName || "");
  const [phone, setPhone] = useState(profile?.phoneNumber || "");
  const [street, setStreet] = useState(profile?.addresses?.[0]?.street || "");
  const [city, setCity] = useState(profile?.addresses?.[0]?.city || "");
  const [stateName, setStateName] = useState(profile?.addresses?.[0]?.state || "Uttar Pradesh");
  const [pincode, setPincode] = useState(profile?.addresses?.[0]?.pincode || "");
  const [email, setEmail] = useState(user?.email || "");
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");

  const [paymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS.COD as PaymentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-populate when user / profile loads
  useEffect(() => {
    if (profile) {
      if (!fullName && profile.displayName) setFullName(profile.displayName);
      if (!phone && profile.phoneNumber) setPhone(profile.phoneNumber);
      if (profile.addresses && profile.addresses.length > 0) {
        const defaultAddr = profile.addresses.find((a) => a.isDefault) || profile.addresses[0];
        if (!street && defaultAddr.street) setStreet(defaultAddr.street);
        if (!city && defaultAddr.city) setCity(defaultAddr.city);
        if (defaultAddr.state) setStateName(defaultAddr.state);
        if (!pincode && defaultAddr.pincode) setPincode(defaultAddr.pincode);
      }
    }
    if (user && !email && user.email) {
      setEmail(user.email);
    }
  }, [profile, user]);

  const shippingFee = subtotal >= APP_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : APP_CONFIG.SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-1">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500 mb-6">
          Add items from our collection to complete your order.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1A120B] text-white font-bold text-xs uppercase tracking-wider"
        >
          <span>Return to Shop</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const cleanPincode = pincode.replace(/[^0-9]/g, "");
    if (cleanPincode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit postal PIN code.");
      return;
    }

    if (!fullName.trim() || !street.trim() || !city.trim()) {
      setErrorMessage("Please fill all required delivery address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        price: i.price,
        quantity: i.quantity,
        image: i.product.thumbnail || i.product.images[0],
      }));

      const fullStreet = deliveryNote.trim()
        ? `${street.trim()} (Note: ${deliveryNote.trim()})`
        : street.trim();

      const newOrder = await createOrder({
        userId: user ? user.uid : `guest-${Date.now()}`,
        userEmail: email.trim() || `${cleanPhone}@vedikadivine.guest`,
        items: orderItems,
        subtotal,
        shippingFee,
        discount: 0,
        total: totalAmount,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: cleanPhone,
          street: fullStreet,
          city: city.trim(),
          state: stateName,
          pincode: cleanPincode,
        },
        paymentMethod: PAYMENT_METHODS.COD,
        paymentStatus: "Pending",
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
    <div className="bg-[#FAF7F2] min-h-screen pb-32 pt-4 sm:pt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Simple Top Navigation Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200/80 mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900 font-serif">Checkout</span>
            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Cash On Delivery
            </span>
          </div>
        </div>

        {/* Error Alert if validation fails */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <h2 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                  Delivery Address
                </h2>
              </div>
              <span className="text-[10px] text-stone-400 font-medium">* Required</span>
            </div>

            {/* Saved Address Quick Selector */}
            {profile?.addresses && profile.addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2">
                {profile.addresses.map((addr, idx) => {
                  const isSelected = street === addr.street && pincode === addr.pincode;
                  return (
                    <button
                      key={addr.id || idx}
                      type="button"
                      onClick={() => {
                        setStreet(addr.street);
                        setCity(addr.city);
                        setStateName(addr.state);
                        setPincode(addr.pincode);
                        if (addr.fullName) setFullName(addr.fullName);
                        if (addr.phone) setPhone(addr.phone);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${isSelected
                        ? "border-amber-600 bg-amber-50/70 ring-1 ring-amber-600 font-medium"
                        : "border-stone-200 hover:border-amber-300 bg-stone-50/40"
                        }`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-stone-900">
                          {addr.isDefault ? "Primary Address" : `Address #${idx + 1}`}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-stone-700 truncate font-semibold">{addr.fullName || fullName}</p>
                      <p className="text-stone-500 text-[11px] truncate">{addr.street}</p>
                      <p className="text-stone-500 text-[11px]">{addr.city}, {addr.state} - {addr.pincode}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Address Fields */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="10-digit number"
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  House / Flat No., Street, Landmark *
                </label>
                <textarea
                  required
                  rows={2}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Complete street address, building name, near landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="6-digit PIN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City / Town"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    State *
                  </label>
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Collapsible Optional Extra Fields */}
              {!showExtraFields ? (
                <button
                  type="button"
                  onClick={() => setShowExtraFields(true)}
                  className="text-[11px] font-semibold text-amber-800 hover:underline pt-1 inline-block"
                >
                  + Add Email or Delivery Note (Optional)
                </button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Receipt & tracking email"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Delivery Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="e.g. Call before arrival"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Payment Method Card (Cut to cut) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Banknote className="w-4 h-4 text-amber-700" />
              <h2 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                Payment Method
              </h2>
            </div>

            {/* COD Option (Active) */}
            <div className="p-3.5 rounded-xl border-2 border-amber-600 bg-amber-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="cod-active"
                  name="pay_mode"
                  checked={true}
                  readOnly
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <label htmlFor="cod-active" className="cursor-pointer">
                  <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[11px] text-stone-600 block mt-0.5">
                    Pay in cash or UPI when your parcel arrives.
                  </span>
                </label>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                Active
              </span>
            </div>

            {/* Online Payment Option (Coming Soon) */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 opacity-80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="online-disabled"
                  name="pay_mode"
                  disabled
                  checked={false}
                  className="w-4 h-4 text-stone-300 cursor-not-allowed"
                />
                <label htmlFor="online-disabled" className="cursor-not-allowed">
                  <span className="font-medium text-stone-700 text-xs sm:text-sm block">
                    Online Payment (UPI / Cards)
                  </span>
                  <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">
                    Coming soon after next update!
                  </span>
                </label>
              </div>
              <span className="text-[9px] uppercase font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-md shrink-0">
                Soon
              </span>
            </div>
          </div>

          {/* 3. Items in Order Summary Card */}
          <div id="order-items-section" className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                  Items in Order ({items.length})
                </h3>
              </div>
              <Link
                href="/cart"
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                Edit
              </Link>
            </div>

            <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.productId} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={i.product.thumbnail || i.product.images[0]}
                      alt={i.product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
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

            {/* Price Row Breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong className="text-emerald-700 font-bold">FREE</strong>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold pt-1.5 border-t border-stone-100 text-sm">
                <span>Total Payable</span>
                <span className="font-serif text-base text-amber-900">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* User Requested: Sticky Buy Button Footer Bar (Identical to Reference Image) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-6px_25px_rgba(0,0,0,0.12)] py-3 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Total Price (Exact match to reference image) */}
          <div className="shrink-0">
            <span className="text-[10px] tracking-wider uppercase font-bold text-stone-400 block leading-none">
              TOTAL PRICE
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold font-serif text-stone-950 leading-tight">
                {formatCurrency(totalAmount)}
              </span>
              {shippingFee === 0 && (
                <span className="hidden sm:inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  FREE Delivery
                </span>
              )}
            </div>
          </div>

          {/* Right: Action Buttons (Bag view + Buy Now button) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bag Button (like reference image) */}
            <Link
              href="/cart"
              className="py-2.5 px-3 sm:px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              title="View Bag"
            >
              <ShoppingBag className="w-4 h-4 text-stone-700" />
              <span className="hidden xs:inline">Bag</span>
              <span className="font-bold text-amber-800">({items.length})</span>
            </Link>

            {/* Place Order / Buy Now Action Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="py-3 px-6 sm:px-10 rounded-xl bg-[#1A120B] hover:bg-stone-900 active:scale-98 text-white font-bold text-xs sm:text-sm tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 disabled:opacity-60 disabled:hover:scale-100 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Buy Now (COD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
