"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Package,
  LogOut,
  Plus,
  ShieldCheck,
  Building2,
  Sparkles,
  Flame,
  Award,
  Crown,
  CheckCircle2,
  Heart,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Check,
  Truck,
  ArrowRight,
  Lock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Address,
  Order,
  getUserOrders,
  formatCurrency,
  formatDate,
  resetPassword,
} from "@backend/index";
import { OrderTrackingModal } from "@/components/orders/OrderTrackingModal";

type ProfileTab = "profile" | "orders" | "addresses" | "security";

export default function ProfilePage() {
  const {
    user,
    profile,
    logout,
    updateProfileData,
    addOrUpdateAddress,
    removeAddress,
    makeAddressDefault,
    isDealer,
    isAdmin,
    loading: authLoading,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

  // Profile Edit State
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("");
  const [isDefaultAddr, setIsDefaultAddr] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Orders State
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Security State
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setPhoneNumber(profile.phoneNumber || "");
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      setOrdersLoading(true);
      getUserOrders(user.uid)
        .then((orders) => setRecentOrders(orders))
        .finally(() => setOrdersLoading(false));
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center py-20 px-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-black text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-black">
            Customer Account Access
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Please sign in to view your profile, manage saved delivery addresses, and track your candle orders.
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfileData({ displayName, phoneNumber });
      setProfileMsg({ type: "success", text: "Profile details updated successfully!" });
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setFullName(profile?.displayName || "");
    setPhone(profile?.phoneNumber || "");
    setStreet("");
    setApartment("");
    setCity("");
    setStateName("Uttar Pradesh");
    setPincode("");
    setIsDefaultAddr((profile?.addresses?.length || 0) === 0);
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id || null);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setStreet(addr.street);
    setApartment(addr.apartment || "");
    setCity(addr.city);
    setStateName(addr.state);
    setPincode(addr.pincode);
    setIsDefaultAddr(Boolean(addr.isDefault));
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !pincode) return;
    setSavingAddress(true);
    try {
      const addrData: Address = {
        id: editingAddressId || undefined,
        fullName,
        phone,
        street,
        apartment,
        city,
        state: stateName,
        pincode,
        isDefault: isDefaultAddr,
      };
      await addOrUpdateAddress(addrData);
      setShowAddressModal(false);
    } catch (err) {
      console.warn("Failed to save address:", err);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId?: string) => {
    if (!addressId) return;
    if (confirm("Are you sure you want to delete this delivery address?")) {
      await removeAddress(addressId);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!user.email) return;
    setResetLoading(true);
    try {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err: any) {
      alert("Failed to send reset email: " + err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] w-full max-w-full overflow-x-hidden">
      {/* Luxury Account Header */}
      <section className="relative bg-[#0C0A09] text-white py-12 sm:py-16 border-b border-amber-900/50 overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-radial from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
              <span>Vedika Divine Member Account</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {profile?.displayName || "My Candle Account"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400">
              Manage personal profile, track live artisanal shipments, and update delivery addresses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs shadow-md hover:bg-amber-100 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Track Consignment</span>
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-rose-400 bg-stone-900 border border-stone-800 hover:bg-rose-950/60 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Account Dashboard */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Profile Card & Tab Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-amber-200 shadow-sm text-center space-y-4">
              <div className="w-22 h-22 rounded-full bg-black text-amber-400 font-serif text-3xl font-bold flex items-center justify-center mx-auto shadow-xl border-2 border-amber-400">
                {profile?.displayName ? profile.displayName[0].toUpperCase() : "V"}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-black">
                  {profile?.displayName || "Valued Candle Lover"}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">{user.email}</p>
                {profile?.phoneNumber && (
                  <p className="text-xs text-stone-600 font-medium mt-1">
                    📞 +91 {profile.phoneNumber}
                  </p>
                )}
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-[11px] uppercase tracking-wider">
                  Role: {profile?.role || "Customer"}
                </span>
              </div>

              {/* Special Role Badges */}
              {isDealer && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-1">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span>Dealer Partner Active</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Access wholesale master carton bulk pricing & GST billing.
                  </p>
                  <Link
                    href="/dealer/dashboard"
                    className="inline-block text-xs font-bold text-amber-800 underline mt-1"
                  >
                    Go to Dealer Portal →
                  </Link>
                </div>
              )}

              {isAdmin && (
                <div className="p-3.5 rounded-2xl bg-stone-900 text-white border border-amber-500/40 text-left space-y-1 shadow-md">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Crown className="w-4 h-4 fill-amber-400" />
                    <span>Admin Console Access</span>
                  </div>
                  <p className="text-[11px] text-stone-300">
                    Full management of inventory, dealer approvals, and orders.
                  </p>
                  <Link
                    href="/admin"
                    className="inline-block text-xs font-bold text-amber-400 underline mt-1"
                  >
                    Open Admin Console →
                  </Link>
                </div>
              )}
            </div>

            {/* Account Tabs Nav */}
            <div className="bg-white p-3 rounded-3xl border border-amber-200 shadow-sm space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-black text-amber-400 shadow-md"
                    : "text-stone-700 hover:bg-amber-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Personal Profile Details</span>
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-black text-amber-400 shadow-md"
                    : "text-stone-700 hover:bg-amber-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>My Orders & Tracking ({recentOrders.length})</span>
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-black text-amber-400 shadow-md"
                    : "text-stone-700 hover:bg-amber-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Addresses ({profile?.addresses?.length || 0})</span>
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "security"
                    ? "bg-black text-amber-400 shadow-md"
                    : "text-stone-700 hover:bg-amber-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4" />
                  <span>Security & Password</span>
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tab Content Container */}
          <div className="lg:col-span-8 space-y-6">
            {/* TAB 1: Profile Details */}
            {activeTab === "profile" && (
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-amber-100">
                  <h3 className="font-serif font-bold text-xl text-black">
                    Edit Personal Profile
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update your full name and phone number for shipping updates & delivery notifications.
                  </p>
                </div>

                {profileMsg && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
                      profileMsg.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border border-rose-200 text-rose-800"
                    }`}
                  >
                    {profileMsg.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-amber-300 text-black placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                      <User className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Email Address (Permanent Account ID)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={user.email || ""}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-100 text-stone-500 cursor-not-allowed"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                      Phone Number (For WhatsApp / SMS Delivery Updates)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-amber-300 text-black placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                      <Phone className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-8 py-3.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Orders & Tracking */}
            {activeTab === "orders" && (
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-amber-100 gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-black">
                      My Candle Orders
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Review your artisanal order records and live consignment tracking.
                    </p>
                  </div>

                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-semibold"
                  >
                    <span>Full Orders History</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {ordersLoading ? (
                  <div className="py-12 text-center text-xs text-stone-500">
                    <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading your orders...</span>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-amber-200 rounded-2xl p-6 space-y-3">
                    <Package className="w-8 h-8 text-amber-600 mx-auto" />
                    <p className="font-serif font-bold text-sm text-black">
                      No Orders Placed Yet
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Explore our handcrafted scented candles and temple offerings.
                    </p>
                    <Link
                      href="/shop"
                      className="inline-block px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold"
                    >
                      Browse Candles
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order, idx) => (
                      <div
                        key={order.id || idx}
                        className="p-5 rounded-2xl border border-amber-200 bg-[#FFFDF9] space-y-3"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-amber-100 pb-2.5">
                          <div>
                            <span className="font-mono text-xs font-bold text-black uppercase">
                              Order #{order.orderNumber}
                            </span>
                            <span className="text-[10px] text-stone-500 ml-2">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : order.status === "Shipped"
                                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                                  : "bg-black text-amber-400"
                              }`}
                            >
                              {order.status}
                            </span>

                            <button
                              onClick={() => setTrackingOrder(order)}
                              className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Track</span>
                            </button>
                          </div>
                        </div>

                        {/* Items preview */}
                        <div className="flex items-center justify-between text-xs">
                          <p className="text-stone-600">
                            {order.items.length} item(s):{" "}
                            <strong>{order.items.map((i) => i.name).slice(0, 2).join(", ")}</strong>
                            {order.items.length > 2 && "..."}
                          </p>
                          <p className="font-serif font-bold text-black">
                            {formatCurrency(order.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Saved Delivery Addresses */}
            {activeTab === "addresses" && (
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-amber-100 gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-black">
                      Saved Delivery Addresses
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Doorstep shipping addresses used for fast 1-click checkout.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-stone-900 text-white font-semibold text-xs shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {profile?.addresses && profile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((addr, idx) => (
                      <div
                        key={addr.id || idx}
                        className={`p-5 rounded-2xl border space-y-2.5 relative ${
                          addr.isDefault
                            ? "border-amber-400 bg-amber-50/40 shadow-xs"
                            : "border-stone-200 bg-[#FFFDF9]"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2 text-black font-bold text-sm">
                            <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>{addr.fullName}</span>
                          </div>

                          {addr.isDefault ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider">
                              Default
                            </span>
                          ) : (
                            <button
                              onClick={() => makeAddressDefault(addr.id!)}
                              className="text-[10px] text-amber-800 hover:underline font-semibold cursor-pointer"
                            >
                              Make Default
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed font-normal">
                          {addr.street}
                          {addr.apartment ? `, ${addr.apartment}` : ""}, {addr.city},{" "}
                          {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-xs text-stone-500 font-medium">
                          📞 Phone: +91 {addr.phone}
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-amber-100/60 text-xs">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="inline-flex items-center gap-1 text-stone-700 hover:text-black font-semibold cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-amber-700" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border-2 border-dashed border-amber-200 rounded-2xl p-6 space-y-3">
                    <MapPin className="w-8 h-8 text-amber-600 mx-auto" />
                    <p className="font-serif font-bold text-sm text-black">
                      No Addresses Saved Yet
                    </p>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Add your shipping address for fast 1-click checkout on your next scented candle orders.
                    </p>
                    <button
                      onClick={handleOpenAddAddress}
                      className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold"
                    >
                      Add Address Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Security & Password */}
            {activeTab === "security" && (
              <div className="bg-white p-7 sm:p-8 rounded-3xl border border-amber-200 shadow-sm space-y-6">
                <div className="pb-4 border-b border-amber-100">
                  <h3 className="font-serif font-bold text-xl text-black">
                    Security & Credentials
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Manage password reset instructions and account session access.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                    <h4 className="font-serif font-bold text-sm text-black flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>Change Account Password</span>
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      We will send a secure password reset link directly to your registered email (<strong>{user.email}</strong>). Follow the link to choose a new password.
                    </p>

                    {resetSent && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Password reset email has been sent! Please check your inbox.</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        onClick={handleSendPasswordReset}
                        disabled={resetLoading}
                        className="px-5 py-2.5 rounded-full bg-black hover:bg-stone-900 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {resetLoading ? "Sending Link..." : "Send Password Reset Link"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                    <h4 className="font-serif font-bold text-sm text-rose-900 flex items-center gap-2">
                      <LogOut className="w-4 h-4 text-rose-700" />
                      <span>End Current Session</span>
                    </h4>
                    <p className="text-rose-700 leading-relaxed">
                      Log out from this browser session. You can sign back in anytime using your email and password.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={logout}
                        className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Sign Out of Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-amber-300 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-amber-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-black">
                {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-stone-400 hover:text-black cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 rounded-xl border border-amber-300 text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 rounded-xl border border-amber-300 text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Street Address / House No. *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Flat/House No, Colony, Street name"
                  className="w-full p-3 rounded-xl border border-amber-300 text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Apartment / Landmark (Optional)</label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="e.g. Near Temple, 2nd Floor"
                  className="w-full p-3 rounded-xl border border-amber-300 text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kushinagar"
                    className="w-full p-3 rounded-xl border border-amber-300 text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="6-digit PIN"
                    className="w-full p-3 rounded-xl border border-amber-300 text-black focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefaultCheckbox"
                  checked={isDefaultAddr}
                  onChange={(e) => setIsDefaultAddr(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <label htmlFor="isDefaultCheckbox" className="font-semibold text-stone-800 cursor-pointer">
                  Set as default delivery address for future orders
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-6 py-2.5 rounded-full bg-black text-white font-bold hover:bg-stone-900 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {savingAddress ? "Saving..." : editingAddressId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Order Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
}
