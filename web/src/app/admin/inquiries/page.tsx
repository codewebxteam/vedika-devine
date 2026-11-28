"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Phone,
  Eye,
  RefreshCw,
  ExternalLink,
  Trash2,
  AlertCircle,
  Clock,
  MapPin,
  Package,
} from "lucide-react";
import {
  WholesaleInquiry,
  getAllInquiries,
  deleteInquiry,
  formatDate,
} from "@backend/index";
import { InquiryDetailsModal } from "@/components/admin/InquiryDetailsModal";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<WholesaleInquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await getAllInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter((inq) => {
    return (
      inq.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      inq.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
      inq.city?.toLowerCase().includes(search.toLowerCase()) ||
      inq.phone?.includes(search)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>B2B Dealer Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Wholesale & Carton Inquiries
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Compact leads list • Real-time follow-up tracking • Click &ldquo;View Details&rdquo; for required items, buyer notes, and deal closure.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Business Name, Contact Person, City, Phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
        />
      </div>

      {/* Compact Inquiries Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Business & City</th>
                <th className="py-3.5 px-4">Contact Person</th>
                <th className="py-3.5 px-4">Volume Required</th>
                <th className="py-3.5 px-4">Received Date</th>
                <th className="py-3.5 px-4">Direct Connect</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No wholesale inquiries found. Leads submitted on the /wholesale page will be listed here.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const receivedMs = inq.createdAt ? Number(inq.createdAt) : Date.now();
                  const daysAgo = Math.max(
                    0,
                    Math.floor((Date.now() - receivedMs) / (24 * 60 * 60 * 1000))
                  );
                  const isUrgent = daysAgo >= 2;

                  const cleanPhone = inq.phone?.replace(/[^0-9]/g, "") || "";
                  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                    `Namaste ${inq.contactPerson || inq.businessName}, this is M/S RMPG Vedika Divine Home Industries regarding your wholesale inquiry for sacred pooja samagri.`
                  )}`;

                  return (
                    <tr
                      key={inq.id}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Business & City */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white text-xs block group-hover:text-amber-400 transition-colors">
                          {inq.businessName}
                        </span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-500" />
                          <span>{inq.city || "India"}</span>
                        </span>
                      </td>

                      {/* Contact Person */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-200 text-xs">
                          {inq.contactPerson || "Retailer"}
                        </p>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                          {inq.phone}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 font-bold text-xs">
                          📦 {inq.estimatedQuantity || "Bulk Deal"}
                        </span>
                      </td>

                      {/* Date & Urgency */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="text-stone-300 block text-xs">
                            {formatDate(inq.createdAt)}
                          </span>
                          {isUrgent ? (
                            <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-700">
                              🚨 Urgent ({daysAgo}d ago)
                            </span>
                          ) : (
                            <span className="text-[10px] text-stone-500">
                              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Direct Connect: WhatsApp & Call */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${inq.phone}`}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                            title="Call Phone"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* View Details */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
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

      {/* Modal for Details */}
      {selectedInquiry && (
        <InquiryDetailsModal
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onDeleted={(id) => {
            setInquiries((prev) => prev.filter((i) => i.id !== id));
          }}
        />
      )}
    </div>
  );
}
