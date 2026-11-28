"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Product,
  Category,
  CATEGORIES,
  getProducts,
  getCategories,
  deleteProduct,
  clearAllProducts,
  formatCurrency,
} from "@backend/index";
import { ProductModal } from "@/components/admin/ProductModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [data, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(data);
      setCategories(cats);
    } catch (err) {
      console.error("Error fetching catalog:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (p: Product) => {
    if (!confirm(`Are you sure you want to permanently delete "${p.name}"?`)) return;
    setDeletingId(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((prev) => prev.filter((item) => item.id !== p.id));
      setAlertMsg(`Deleted "${p.name}" permanently from catalog and database.`);
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err: any) {
      setAlertMsg(`Delete failed: ${err.message}`);
    }
    setDeletingId(null);
  };

  const handleClearAllProducts = async () => {
    if (products.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to permanently DELETE ALL ${products.length} products? This will completely empty the catalog from Firestore so you can add your genuine products.`
      )
    )
      return;
    setLoading(true);
    try {
      await clearAllProducts();
      setProducts([]);
      setAlertMsg("All products cleared permanently from catalog!");
      setTimeout(() => setAlertMsg(null), 3500);
    } catch (err: any) {
      setAlertMsg(`Failed to clear: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.waxType?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || p.categorySlug === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Pooja Samagri & Product Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Product Catalog Management (पूजा सामग्री)
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Compact inventory list • Click &ldquo;View More / Edit&rdquo; to modify specifications, fragrances, and wholesale carton pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchCatalog}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 transition-colors"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleClearAllProducts}
            disabled={loading || products.length === 0}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-800/50 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear all products from catalog"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All ({products.length})</span>
          </button>
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700/80 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>1. Categories</span>
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
            <span>2. Add New Product</span>
          </button>
        </div>
      </div>

      {alertMsg && (
        <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, category, fragrance..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 focus:outline-hidden focus:border-amber-500 cursor-pointer"
        >
          <option value="all">All Categories ({products.length})</option>
          {(categories.length > 0 ? categories : CATEGORIES).map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Compact Products Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-950/70 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Sacred Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Burn Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-500">
                    No products found. Click &ldquo;Add New Product&rdquo; to add your first product.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLowStock = (p.stock || 0) < 10;
                  const isOutOfStock = (p.stock || 0) <= 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-stone-800/40 transition-colors group"
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              p.thumbnail ||
                              p.images?.[0] ||
                              "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=150&q=80"
                            }
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-800 shrink-0 bg-stone-950"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white text-xs truncate max-w-xs group-hover:text-amber-400 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-stone-500 truncate mt-0.5">
                              {p.waxType || "Botanical Wax"} • {p.fragranceNotes?.top || "Aromatic"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-stone-800 text-stone-300 text-[11px] font-medium whitespace-nowrap">
                          {p.category}
                        </span>
                      </td>

                      {/* Price & MRP */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-serif font-bold text-amber-400 text-sm">
                          {formatCurrency(p.price)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-stone-500 line-through ml-1.5">
                            {formatCurrency(p.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isOutOfStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            Low Stock ({p.stock})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                            In Stock ({p.stock})
                          </span>
                        )}
                      </td>

                      {/* Burn Time */}
                      <td className="py-3 px-4 whitespace-nowrap text-stone-400 text-[11px]">
                        🔥 {p.burnTime || "40+ Hrs"}
                      </td>

                      {/* Compact Actions: View More / Edit */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="px-3 py-1.5 rounded-xl bg-amber-600/10 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View More / Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Product Add/Edit Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchCatalog}
      />
    </div>
  );
}
