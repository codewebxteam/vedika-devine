"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  FileText,
  AlertCircle,
  Percent,
  Coins,
  Store,
  TrendingUp,
  Edit3,
  Save,
  X,
} from "lucide-react";
import {
  UserProfile,
  Order,
  getAllDealers,
  getAllOrders,
  approveDealerAccount,
  rejectDealerAccount,
  updateDealerCommissionRate,
  formatCurrency,
  formatDate,
} from "@backend/index";

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">(
    "pending"
  );
  const [actionUid, setActionUid] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Commission Editor State
  const [editingCommissionUid, setEditingCommissionUid] = useState<string | null>(null);
  const [commissionInput, setCommissionInput] = useState<number>(10);
  const [territoryInput, setTerritoryInput] = useState<string>("");
  const [savingCommission, setSavingCommission] = useState(false);

  const fetchDealersAndOrders = async () => {
    setLoading(true);
    try {
      const [dealersData, ordersData] = await Promise.all([
        getAllDealers(),
        getAllOrders(),
      ]);
      setDealers(dealersData);
      setOrders(ordersData);
    } catch (err: any) {
      console.error("Error fetching dealers & orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDealersAndOrders();
  }, []);

  const handleApprove = async (dealer: UserProfile) => {
    setActionUid(dealer.uid);
    setMessage(null);
    try {
      await approveDealerAccount(dealer.uid);
      setDealers((prev) =>
        prev.map((d) =>
          d.uid === dealer.uid
            ? {
                ...d,
                role: "dealer",
                dealerInfo: d.dealerInfo
                  ? { ...d.dealerInfo, status: "approved" }
                  : undefined,
              }
            : d
        )
      );
      setMessage(
        `Approved ${dealer.dealerInfo?.businessName || dealer.displayName} as official Wholesale Dealer Partner!`
      );
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    }
    setActionUid(null);
  };

  const handleReject = async (dealer: UserProfile) => {
    if (!confirm(`Are you sure you want to reject / demote ${dealer.displayName}?`)) return;
    setActionUid(dealer.uid);
    setMessage(null);
    try {
      await rejectDealerAccount(dealer.uid);
      setDealers((prev) =>
        prev.map((d) =>
          d.uid === dealer.uid
            ? {
                ...d,
                role: "customer",
                dealerInfo: d.dealerInfo
                  ? { ...d.dealerInfo, status: "rejected" }
                  : undefined,
              }
            : d
        )
      );
      setMessage(`Updated account role to regular customer.`);
    } catch (err: any) {
      alert(`Rejection error: ${err.message}`);
    }
    setActionUid(null);
  };

  const handleStartEditCommission = (dealer: UserProfile) => {
    setEditingCommissionUid(dealer.uid);
    setCommissionInput(dealer.dealerInfo?.commissionRate ?? 10);
    setTerritoryInput(dealer.dealerInfo?.assignedTerritory || dealer.dealerInfo?.city || "");
  };

  const handleSaveCommission = async (uid: string) => {
    setSavingCommission(true);
    setMessage(null);
    try {
      await updateDealerCommissionRate(uid, commissionInput, territoryInput.trim());
      setDealers((prev) =>
        prev.map((d) =>
          d.uid === uid
            ? {
                ...d,
                dealerInfo: d.dealerInfo
                  ? {
                      ...d.dealerInfo,
                      commissionRate: commissionInput,
                      assignedTerritory: territoryInput.trim(),
                    }
                  : undefined,
              }
            : d
        )
      );
      setMessage(`Successfully updated commission rate to ${commissionInput}% for distributor!`);
      setEditingCommissionUid(null);
    } catch (err: any) {
      alert(`Failed to update commission: ${err.message}`);
    }
    setSavingCommission(false);
  };

  // Compute Overall KPI Metrics
  const distributorOrders = orders.filter((o) => o.orderType === "distributor_assisted");
  const totalAssistedSales = distributorOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCommissionPayable = distributorOrders.reduce(
    (sum, o) => sum + (o.partnerCommissionAmount || 0),
    0
  );

  const pendingCount = dealers.filter(
    (d) => d.role === "dealer_pending" || d.dealerInfo?.status === "pending"
  ).length;

  const approvedCount = dealers.filter(
    (d) => d.role === "dealer" || d.dealerInfo?.status === "approved"
  ).length;

  const filteredDealers = dealers.filter((d) => {
    const isPending =
      d.role === "dealer_pending" || d.dealerInfo?.status === "pending";
    const isApproved =
      d.role === "dealer" || d.dealerInfo?.status === "approved";

    if (activeTab === "pending" && !isPending) return false;
    if (activeTab === "approved" && !isApproved) return false;

    const s = search.toLowerCase();
    return (
      d.displayName?.toLowerCase().includes(s) ||
      d.email?.toLowerCase().includes(s) ||
      d.dealerInfo?.businessName?.toLowerCase().includes(s) ||
      d.dealerInfo?.city?.toLowerCase().includes(s) ||
      d.dealerInfo?.phone?.includes(s) ||
      d.dealerInfo?.assignedTerritory?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>B2B Wholesale Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Dealer Partner Approvals
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review partner requests • Approve dealer credentials to activate wholesale carton pricing access.
          </p>
        </div>

        <button
          onClick={fetchDealersAndOrders}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Top Distributor Network KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Active Distributors</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1.5">
            {approvedCount}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            {pendingCount} Pending Approvals
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Shop Orders Booked</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1.5">
            {distributorOrders.length}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            By Field Distributors
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Distributor Retail Sales</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1.5">
            {formatCurrency(totalAssistedSales)}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            Total Dukan Revenue
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span>Total Commission</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-1.5">
            {formatCurrency(totalCommissionPayable)}
          </p>
          <p className="text-[10px] text-stone-500 mt-0.5">
            Distributor Earnings
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "pending"
                ? "bg-amber-600 text-white shadow-md shadow-amber-950/60"
                : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals ({pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "approved"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/60"
                : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Dealers ({approvedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === "all"
                ? "bg-stone-800 text-white border border-stone-700"
                : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
            }`}
          >
            All ({dealers.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search business, owner, city..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>
      </div>

      {/* Dealer Cards Grid */}
      <div className="space-y-4">
        {filteredDealers.length === 0 ? (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center text-stone-500 space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-stone-600" />
            <h3 className="font-bold text-stone-400 text-sm">
              No Dealer Applications in this view
            </h3>
            <p className="text-xs text-stone-600 max-w-sm mx-auto">
              When wholesale partners fill out &ldquo;Become a Partner&rdquo; on the dealer portal, their applications will appear here for 1-click verification.
            </p>
          </div>
        ) : (
          filteredDealers.map((d) => {
            const isApproved =
              d.role === "dealer" || d.dealerInfo?.status === "approved";
            const isPending = !isApproved;
            const isActing = actionUid === d.uid;

            const dealerOrders = orders.filter((o) => o.bookedByPartnerId === d.uid);
            const dealerSales = dealerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            const dealerComm = dealerOrders.reduce(
              (sum, o) => sum + (o.partnerCommissionAmount || 0),
              0
            );
            const currentCommissionRate = d.dealerInfo?.commissionRate ?? 10;

            const cleanPhone = (d.dealerInfo?.phone || d.phoneNumber || "").replace(
              /[^0-9]/g,
              ""
            );
            const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
              `Namaste ${d.dealerInfo?.contactPerson || d.displayName}, this is M/S RMPG Vedika Divine Home Industries regarding your Dealer Partner Account.`
            )}`;

            return (
              <div
                key={d.uid}
                className={`bg-stone-900 border rounded-3xl p-5 sm:p-6 transition-all shadow-md ${
                  isPending
                    ? "border-amber-700/80 bg-linear-to-r from-stone-900 via-amber-950/20 to-stone-900"
                    : "border-stone-800"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Info */}
                  <div className="space-y-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-serif font-bold text-white text-base">
                        {d.dealerInfo?.businessName || d.displayName || "Shop / Business"}
                      </h3>
                      {isApproved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved Dealer</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Approval Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-300">
                      <p className="flex items-center gap-1.5">
                        <span className="text-stone-500">Contact:</span>
                        <strong className="text-white">
                          {d.dealerInfo?.contactPerson || d.displayName}
                        </strong>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {d.dealerInfo?.city || "India"}
                          {d.dealerInfo?.state ? `, ${d.dealerInfo.state}` : ""}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-500" />
                        <span className="font-mono text-[11px] truncate">
                          {d.email}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-400 pt-1 border-t border-stone-800">
                      <span>
                        Phone:{" "}
                        <strong className="text-stone-200">
                          {d.dealerInfo?.phone || d.phoneNumber || "N/A"}
                        </strong>
                      </span>
                      {d.dealerInfo?.gstNumber && (
                        <span>
                          GST:{" "}
                          <strong className="text-amber-300 font-mono">
                            {d.dealerInfo.gstNumber}
                          </strong>
                        </span>
                      )}
                      <span>
                        Expected Volume:{" "}
                        <strong className="text-amber-300">
                          {d.dealerInfo?.estimatedMonthlyVolume || "20+ Cartons"}
                        </strong>
                      </span>
                      {d.dealerInfo?.appliedAt && (
                        <span>
                          Applied: {formatDate(d.dealerInfo.appliedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-800">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${d.dealerInfo?.phone || d.phoneNumber}`}
                      className="p-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                      title="Call Dealer"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    {isPending ? (
                      <button
                        onClick={() => handleApprove(d)}
                        disabled={isActing}
                        className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-950/60 flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isActing ? "Approving..." : "Approve Partner 🤝"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReject(d)}
                        disabled={isActing}
                        className="px-3.5 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-rose-300 text-xs font-semibold transition-colors border border-stone-700"
                      >
                        Demote to Customer
                      </button>
                    )}
                  </div>
                </div>

                {/* Distributor Commission & Retail Performance Block */}
                {isApproved && (
                  <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-stone-950/60 p-3.5 rounded-2xl border border-stone-800/80">
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 font-bold">
                        <Percent className="w-3.5 h-3.5 text-amber-400" />
                        <span>Commission: {currentCommissionRate}%</span>
                      </div>
                      {d.dealerInfo?.assignedTerritory && (
                        <span className="text-stone-400 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-500" />
                          <span>Territory: <strong className="text-stone-200">{d.dealerInfo.assignedTerritory}</strong></span>
                        </span>
                      )}
                      <div className="text-[11px] text-stone-300 flex items-center gap-2">
                        <span>Shop Orders: <strong className="text-white">{dealerOrders.length}</strong></span>
                        <span>•</span>
                        <span>Sales: <strong className="text-white">{formatCurrency(dealerSales)}</strong></span>
                        <span>•</span>
                        <span>Earned: <strong className="text-emerald-400">{formatCurrency(dealerComm)}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartEditCommission(d)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Set Commission %</span>
                    </button>
                  </div>
                )}

                {/* Inline Commission Editor Form */}
                {editingCommissionUid === d.uid && (
                  <div className="mt-3 p-4 rounded-2xl bg-stone-950 border border-amber-500/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Percent className="w-4 h-4 text-amber-400" />
                        <span>Configure Distributor Commission & Territory</span>
                      </span>
                      <button
                        onClick={() => setEditingCommissionUid(null)}
                        className="p-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1 font-semibold">
                          Retail Commission Rate (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={commissionInput}
                            onChange={(e) => setCommissionInput(Number(e.target.value))}
                            className="w-full pl-3 pr-8 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs font-bold focus:border-amber-500 focus:outline-hidden"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">
                            %
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1 font-semibold">
                          Assigned Territory / Region
                        </label>
                        <input
                          type="text"
                          value={territoryInput}
                          onChange={(e) => setTerritoryInput(e.target.value)}
                          placeholder="e.g. Kushinagar & Deoria Belt"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingCommissionUid(null)}
                        className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveCommission(d.uid)}
                        disabled={savingCommission}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-60"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingCommission ? "Saving..." : "Save Commission Rate"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
