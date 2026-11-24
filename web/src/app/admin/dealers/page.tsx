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
} from "lucide-react";
import {
  UserProfile,
  getAllDealers,
  approveDealerAccount,
  rejectDealerAccount,
  formatDate,
} from "@backend/index";

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">(
    "pending"
  );
  const [actionUid, setActionUid] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDealersList = async () => {
    setLoading(true);
    try {
      const data = await getAllDealers();
      setDealers(data);
    } catch (err: any) {
      console.error("Error fetching dealers:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDealersList();
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
      d.dealerInfo?.phone?.includes(s)
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
          onClick={fetchDealersList}
          disabled={loading}
          className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors self-start sm:self-auto"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
