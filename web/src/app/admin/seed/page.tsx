"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Flame,
  ExternalLink,
} from "lucide-react";
import {
  SAMPLE_PRODUCTS,
  seedSampleProductsToFirestore,
  formatCurrency,
} from "@backend/index";

export default function SeedPage() {
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<{ count?: number; error?: string } | null>(
    null
  );

  const handleSeed = async () => {
    setSeeding(true);
    setResult(null);
    try {
      const res = await seedSampleProductsToFirestore();
      setResult(res);
    } catch (e: any) {
      setResult({ error: e.message || "Failed to seed sample items" });
    }
    setSeeding(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Developer & Admin Tools</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Firestore Database Seeder
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Populate your Firebase Firestore with authentic candle products, scents, burn times, and wholesale cartons.
          </p>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-950/60 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${seeding ? "animate-spin" : ""}`} />
          <span>{seeding ? "Populating Firestore..." : "Seed All Candles"}</span>
        </button>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-3 border ${
            result.error
              ? "bg-rose-950/60 border-rose-800 text-rose-300"
              : "bg-emerald-950/60 border-emerald-800 text-emerald-300"
          }`}
        >
          {result.error ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          )}
          <div>
            <p className="font-bold">
              {result.error
                ? "Seeding Failed"
                : `Successfully Seeded ${result.count} Products!`}
            </p>
            <p className="text-[11px] opacity-90 mt-0.5">
              {result.error
                ? result.error
                : "All candle items are now saved in Firestore 'products' collection and visible in your Admin Catalog & Storefront."}
            </p>
          </div>
        </div>
      )}

      {/* Preview Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Ready to Seed Catalog ({SAMPLE_PRODUCTS.length} Candles)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3.5 hover:border-amber-600/40 transition-colors"
            >
              <img
                src={p.thumbnail}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover border border-stone-800 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-white text-xs truncate">{p.name}</p>
                <p className="text-[11px] text-amber-400 font-serif font-bold mt-0.5">
                  {formatCurrency(p.price)}
                </p>
                <p className="text-[10px] text-stone-500 truncate mt-0.5">
                  🔥 {p.burnTime} • {p.waxType}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
