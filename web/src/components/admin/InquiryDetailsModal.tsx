"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  Package,
  Trash2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { WholesaleInquiry, deleteInquiry, formatDate } from "@backend/index";

interface InquiryDetailsModalProps {
  inquiry: WholesaleInquiry | null;
  onClose: () => void;
  onDeleted?: (id: string) => void;
}

export const InquiryDetailsModal: React.FC<InquiryDetailsModalProps> = ({
  inquiry,
  onClose,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!inquiry) return null;

  // Real-time days since received calculation
  const receivedTimestamp = inquiry.createdAt ? Number(inquiry.createdAt) : Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const daysAgo = Math.max(0, Math.floor((Date.now() - receivedTimestamp) / ONE_DAY_MS));
  const isUrgentFollowUp = daysAgo >= 2;

  const cleanPhone = inquiry.phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Namaste ${inquiry.contactPerson || inquiry.businessName}, this is M/S RMPG Vedika Divine Home Industries regarding your wholesale inquiry for sacred pooja samagri.`
  )}`;

  const handleDelete = async () => {
    if (!inquiry.id) return;
    if (!confirm("Are you sure you want to remove this wholesale inquiry?")) return;
    setIsDeleting(true);
    try {
      await deleteInquiry(inquiry.id);
      onDeleted?.(inquiry.id);
      onClose();
    } catch (err: any) {
      alert(`Error deleting inquiry: ${err.message}`);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {inquiry.businessName}
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                <span>Received: {formatDate(inquiry.createdAt)}</span>
                <span>•</span>
                <span
                  className={
                    isUrgentFollowUp
                      ? "text-red-400 font-bold"
                      : "text-amber-400 font-medium"
                  }
                >
                  {daysAgo === 0
                    ? "Today"
                    : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs text-stone-300">
          {/* Urgent Follow-up Banner if not answered within 2 days */}
          {isUrgentFollowUp && (
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-700/80 text-red-300 flex items-center gap-3 shadow-md">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <div>
                <p className="font-bold text-xs">
                  🚨 URGENT: Wholesale lead waiting for follow-up!
                </p>
                <p className="text-[11px] text-red-400/90 mt-0.5">
                  Inquiry was submitted {daysAgo} days ago. Contact the buyer via WhatsApp or Phone to convert this bulk deal.
                </p>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Contact Person
              </span>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                {inquiry.contactPerson || "Not Provided"}
              </p>
              <div className="pt-2 flex flex-col gap-1.5 border-t border-stone-800/60">
                <p className="flex items-center gap-2 text-stone-300">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="hover:text-amber-400 font-mono text-xs"
                  >
                    {inquiry.phone}
                  </a>
                </p>
                {inquiry.email && (
                  <p className="flex items-center gap-2 text-stone-300">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="hover:text-amber-400 text-xs truncate"
                    >
                      {inquiry.email}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Location & City
              </span>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                {inquiry.city || "Not Provided"}
              </p>
              <div className="pt-2 border-t border-stone-800/60">
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1">
                  Estimated Requirement
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 font-bold inline-block text-xs">
                  📦 {inquiry.estimatedQuantity || "Custom Volume"}
                </span>
              </div>
            </div>
          </div>

          {/* Products Needed */}
          <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              Sacred Products / Varieties Required
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {inquiry.candleTypesNeeded?.length ? (
                inquiry.candleTypesNeeded.map((type, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 text-xs font-semibold"
                  >
                    ✨ {type}
                  </span>
                ))
              ) : (
                <span className="text-stone-500 italic">No specific types selected</span>
              )}
            </div>
          </div>

          {/* Custom Message / Requirements */}
          {inquiry.message && (
            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Buyer Note / Specific Requirements
              </span>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-3 rounded-xl border border-stone-800/80">
                &ldquo;{inquiry.message}&rdquo;
              </p>
            </div>
          )}

          {/* Quick Contact Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950/50"
            >
              <span>Connect on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={`tel:${inquiry.phone}`}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-950/50"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Dealer Directly</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-900 border-t border-stone-800 flex justify-between items-center shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : "Delete Inquiry"}</span>
          </button>
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
