"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Flame,
  Sun,
  CircleDot,
  Shield,
  Package,
  Heart,
  Star,
  Gift,
  Moon,
  AlertCircle,
  CheckCircle2,
  Database,
} from "lucide-react";
import {
  Category,
  Product,
  getCategories,
  getProducts,
  deleteCategory,
  clearAllCategories,
  seedDefaultCategories,
} from "@backend/index";
import { CategoryModal } from "@/components/admin/CategoryModal";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Sun,
  CircleDot,
  Shield,
  Package,
  Heart,
  Star,
  Gift,
  Moon,
  Layers,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to permanently delete category "${cat.name}"?`)) return;

    setDeletingId(cat.id);
    try {
      await deleteCategory(cat.id);
      setCategories((prev) => prev.filter((item) => item.id !== cat.id));
      setAlertMsg({ text: `Category "${cat.name}" deleted permanently.`, type: "success" });
      setTimeout(() => setAlertMsg(null), 3500);
    } catch (err: any) {
      setAlertMsg({ text: `Failed to delete: ${err.message}`, type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllCategories = async () => {
    if (categories.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to permanently DELETE ALL ${categories.length} categories? This will clear all existing/dummy categories from Firestore so you can add your own fresh categories.`
      )
    )
      return;
    setLoading(true);
    try {
      await clearAllCategories();
      setCategories([]);
      setAlertMsg({
        text: "All categories cleared permanently from database! You can now create your own categories.",
        type: "success",
      });
      setTimeout(() => setAlertMsg(null), 4000);
    } catch (err: any) {
      setAlertMsg({ text: `Failed to clear categories: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("This will restore default pooja samagri categories if any are missing. Proceed?")) return;
    setLoading(true);
    try {
      const fresh = await seedDefaultCategories();
      setCategories(fresh);
      setAlertMsg({ text: "Default categories synced and restored successfully!", type: "success" });
      setTimeout(() => setAlertMsg(null), 3500);
    } catch (err: any) {
      setAlertMsg({ text: `Sync failed: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Store Taxonomy & Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Pooja Samagri Categories Management
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Create, re-order and customize categories. Changes instantly update the customer store, Shop filter & navigation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
            title="Refresh Categories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleClearAllCategories}
            disabled={loading || categories.length === 0}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/50 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear all categories to start fresh"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All ({categories.length})</span>
          </button>
          <button
            onClick={handleSeedDefaults}
            disabled={loading}
            className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold border border-amber-900/40 flex items-center gap-2 cursor-pointer transition-colors"
            title="Sync / Restore Default Collections"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>2. Add Products</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>3. Stock & Cartons</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-950/60 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-medium border animate-in fade-in ${
            alertMsg.type === "success"
              ? "bg-emerald-950/60 border-emerald-800 text-emerald-300"
              : "bg-rose-950/60 border-rose-800 text-rose-300"
          }`}
        >
          {alertMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Total Categories
            </p>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Catalog Products
            </p>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">
              {products.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Live in Public Shop
            </p>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">
              Active & Synced
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <span className="text-xs text-stone-400">
          Showing <strong className="text-white">{filteredCategories.length}</strong> of {categories.length} categories
        </span>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3 bg-stone-900/50 rounded-3xl border border-stone-800">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-400 font-medium">Loading store categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-stone-900/50 rounded-3xl border border-stone-800">
          <Layers className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-white">No Categories Found</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {search ? "No categories match your search keyword." : "No categories have been created yet."}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase cursor-pointer"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const IconComp = ICON_MAP[cat.icon || "Sparkles"] || Sparkles;
            const catProducts = products.filter(
              (p) => p.categorySlug === cat.slug || p.category === cat.name
            );

            return (
              <div
                key={cat.id}
                className="bg-stone-900/90 rounded-3xl border border-stone-800 overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between shadow-lg hover:shadow-amber-950/30"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-stone-950 flex items-center justify-center p-3 border-b border-stone-800/80">
                    {/* Ambient glow for transparent PNGs */}
                    <div className="absolute inset-4 bg-radial from-amber-400/20 via-amber-200/5 to-transparent rounded-full blur-xl pointer-events-none" />

                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-stone-600 relative z-10">
                        <Flame className="w-10 h-10 text-amber-500/40" />
                        <span className="text-[10px] text-stone-500 font-medium">No Image Uploaded</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                    {/* Order Badge & Icon */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-400">
                        #{cat.displayOrder ?? 1}
                      </span>
                    </div>

                    {/* Product count pill */}
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-stone-700 text-[11px] font-bold text-stone-200">
                      {catProducts.length} Item{catProducts.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-300 transition-colors truncate">
                        {cat.name}
                      </h3>
                    </div>

                    <p className="text-[11px] font-mono text-amber-500/80">
                      /shop?category={cat.slug}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3.5 bg-stone-950/60 border-t border-stone-800/80 flex items-center justify-between gap-2 text-xs">
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-400 transition-colors"
                  >
                    <span>View in Store</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      disabled={deletingId === cat.id}
                      className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-800/60 text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CategoryModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(savedCat) => {
          setCategories((prev) => {
            const exists = prev.some((c) => c.id === savedCat.id);
            if (exists) {
              return prev.map((c) => (c.id === savedCat.id ? savedCat : c));
            }
            return [...prev, savedCat].sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
          });
          setAlertMsg({
            text: `Category "${savedCat.name}" saved successfully and is now active across the website!`,
            type: "success",
          });
          setTimeout(() => setAlertMsg(null), 3500);
        }}
      />
    </div>
  );
}
