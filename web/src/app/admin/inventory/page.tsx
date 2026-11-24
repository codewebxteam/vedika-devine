"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Minus,
  Edit2,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Layers,
  Boxes,
  Truck,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  Product,
  Category,
  getProducts,
  getCategories,
  updateProductStock,
  deleteProduct,
  formatCurrency,
} from "@backend/index";
import { ProductModal } from "@/components/admin/ProductModal";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStockDelta = async (prod: Product, delta: number) => {
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    setUpdatingId(prod.id);
    try {
      await updateProductStock(prod.id, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, stock: newStock, isAvailable: newStock > 0 } : p))
      );
      setAlertMsg({
        text: `Stock for "${prod.name}" updated to ${newStock} units.`,
        type: newStock === 0 ? "warning" : "success",
      });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      setAlertMsg({ text: `Failed to update stock: ${err.message}`, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleAvailability = async (prod: Product) => {
    const nextAvailability = !prod.isAvailable;
    setUpdatingId(prod.id);
    try {
      await updateProductStock(prod.id, prod.stock, nextAvailability);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, isAvailable: nextAvailability } : p))
      );
      setAlertMsg({
        text: `"${prod.name}" marked as ${nextAvailability ? "IN STOCK & ACTIVE" : "OUT OF STOCK"}.`,
        type: nextAvailability ? "success" : "warning",
      });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      setAlertMsg({ text: `Failed to toggle availability: ${err.message}`, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (prod: Product) => {
    if (!confirm(`Are you sure you want to permanently delete "${prod.name}" from catalog and inventory?`)) return;
    setDeletingId(prod.id);
    try {
      await deleteProduct(prod.id);
      setProducts((prev) => prev.filter((p) => p.id !== prod.id));
      setAlertMsg({ text: `Deleted "${prod.name}" from inventory.`, type: "success" });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      setAlertMsg({ text: `Delete failed: ${err.message}`, type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  // Filter calculations
  const totalItems = products.length;
  const inStockCount = products.filter((p) => p.isAvailable && p.stock > 10).length;
  const lowStockCount = products.filter((p) => p.isAvailable && p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => !p.isAvailable || p.stock === 0).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.waxType?.toLowerCase().includes(search.toLowerCase()) ||
      p.packagingUnit?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === "all" || p.categorySlug === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === "in_stock") matchesStatus = p.isAvailable && p.stock > 10;
    if (statusFilter === "low_stock") matchesStatus = p.isAvailable && p.stock > 0 && p.stock <= 10;
    if (statusFilter === "out_of_stock") matchesStatus = !p.isAvailable || p.stock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Boxes className="w-4 h-4" />
            <span>Step 3 • Live Stock & Carton Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Inventory & Packaging Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Quickly adjust stock levels (+/-), toggle out-of-stock items, manage single jar vs master carton bulk quantities, or edit candle details.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700/80 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Manage Categories</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-950/60 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Candle</span>
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-medium border animate-in fade-in ${
            alertMsg.type === "success"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
              : alertMsg.type === "warning"
              ? "bg-amber-950/60 border-amber-800 text-amber-300"
              : "bg-rose-950/60 border-rose-800 text-rose-300"
          }`}
        >
          {alertMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : alertMsg.type === "warning" ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          ) : (
            <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "all"
              ? "bg-stone-900 border-amber-500 shadow-md shadow-amber-950/40"
              : "bg-stone-900/60 border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between text-stone-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Products</span>
            <Package className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-2">{totalItems}</p>
          <span className="text-[10px] text-stone-500 mt-1 block">Catalog inventory</span>
        </button>

        <button
          onClick={() => setStatusFilter("in_stock")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "in_stock"
              ? "bg-stone-900 border-emerald-500 shadow-md shadow-emerald-950/40"
              : "bg-stone-900/60 border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Healthy Stock</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-300 mt-2">{inStockCount}</p>
          <span className="text-[10px] text-stone-500 mt-1 block">&gt; 10 Units in hand</span>
        </button>

        <button
          onClick={() => setStatusFilter("low_stock")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "low_stock"
              ? "bg-stone-900 border-amber-500 shadow-md shadow-amber-950/40"
              : "bg-stone-900/60 border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between text-amber-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-300 mt-2">{lowStockCount}</p>
          <span className="text-[10px] text-stone-500 mt-1 block">1 to 10 Units left</span>
        </button>

        <button
          onClick={() => setStatusFilter("out_of_stock")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "out_of_stock"
              ? "bg-stone-900 border-rose-500 shadow-md shadow-rose-950/40"
              : "bg-stone-900/60 border-stone-800 hover:border-stone-700"
          }`}
        >
          <div className="flex items-center justify-between text-rose-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Out of Stock</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="text-2xl font-serif font-bold text-rose-300 mt-2">{outOfStockCount}</p>
          <span className="text-[10px] text-stone-500 mt-1 block">Unavailable in store</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candle name, carton, wax..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:outline-hidden focus:border-amber-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:outline-hidden focus:border-amber-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">Status: All</option>
            <option value="in_stock">Healthy Stock (&gt;10)</option>
            <option value="low_stock">Low Stock (≤10)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Candle Product</th>
                <th className="py-3.5 px-3">Packaging & Carton</th>
                <th className="py-3.5 px-3">Price & Wholesale</th>
                <th className="py-3.5 px-4 text-center">Live Stock Control</th>
                <th className="py-3.5 px-3 text-center">Store Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-stone-400">
                    <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading candle inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-stone-500">
                    <Boxes className="w-10 h-10 mx-auto text-stone-600 mb-2" />
                    <p className="font-bold text-white text-sm">No Products Match Current Filter</p>
                    <p className="text-[11px] text-stone-400 mt-1">Try resetting search keywords or category filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = !p.isAvailable || (p.stock ?? 0) === 0;
                  const isLow = (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 10;
                  const isUpdating = updatingId === p.id;
                  const isDeleting = deletingId === p.id;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-stone-850/50 transition-colors ${
                        isOutOfStock ? "bg-stone-950/40 opacity-80" : ""
                      }`}
                    >
                      {/* Product Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail || p.images[0]}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover bg-stone-950 border border-stone-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate max-w-xs">{p.name}</p>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-stone-800 text-[10px] text-amber-400 font-medium border border-stone-700">
                              {p.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Packaging & Carton Specs */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5 text-[11px]">
                          <p className="font-semibold text-stone-200">
                            📦 {p.packagingUnit || "Single Piece (Jar/Tin)"}
                          </p>
                          {p.cartonCapacity && (
                            <p className="text-[10px] text-stone-400">
                              🚚 {p.cartonCapacity}
                            </p>
                          )}
                          {p.unitWeight && (
                            <p className="text-[10px] text-stone-500 font-mono">
                              ⚖️ {p.unitWeight}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <p className="font-serif font-bold text-white text-xs">
                            {formatCurrency(p.price)}
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-stone-500 line-through text-[10px] ml-1.5 font-sans">
                                {formatCurrency(p.originalPrice)}
                              </span>
                            )}
                          </p>
                          {p.wholesalePrice ? (
                            <p className="text-[10px] text-amber-400 font-medium">
                              Wholesale: ₹{p.wholesalePrice} (Min {p.wholesaleMinQty || 12})
                            </p>
                          ) : (
                            <p className="text-[10px] text-stone-600">Retail only</p>
                          )}
                        </div>
                      </td>

                      {/* Stock Adjuster */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                            <button
                              type="button"
                              onClick={() => handleStockDelta(p, -5)}
                              disabled={isUpdating || (p.stock || 0) <= 0}
                              className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold cursor-pointer disabled:opacity-40"
                              title="Decrease stock by 5"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStockDelta(p, -1)}
                              disabled={isUpdating || (p.stock || 0) <= 0}
                              className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer disabled:opacity-40"
                              title="Decrease stock by 1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span className="w-12 text-center font-mono font-bold text-sm text-white">
                              {p.stock ?? 0}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleStockDelta(p, 1)}
                              disabled={isUpdating}
                              className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer disabled:opacity-40"
                              title="Increase stock by 1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStockDelta(p, 5)}
                              disabled={isUpdating}
                              className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold cursor-pointer disabled:opacity-40"
                              title="Increase stock by 5"
                            >
                              +5
                            </button>
                          </div>

                          {/* Quick Badge */}
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                              Low Stock ({p.stock} left)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                              Healthy ({p.stock} units)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Store Status Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(p)}
                          disabled={isUpdating}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            p.isAvailable && (p.stock ?? 0) > 0
                              ? "bg-emerald-950/70 border border-emerald-600 text-emerald-300 hover:bg-rose-950 hover:border-rose-700 hover:text-rose-300"
                              : "bg-rose-950/70 border border-rose-600 text-rose-300 hover:bg-emerald-950 hover:border-emerald-700 hover:text-emerald-300"
                          }`}
                          title="Click to toggle availability in customer store"
                        >
                          {p.isAvailable && (p.stock ?? 0) > 0 ? "Live in Store" : "Marked Out"}
                        </button>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                            title="View in Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleEdit(p)}
                            className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors cursor-pointer"
                            title="Edit Full Product Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            disabled={isDeleting}
                            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 border border-rose-800/50 text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded ProductModal so clicking Edit immediately opens the product form with full details */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchData}
      />
    </div>
  );
}
