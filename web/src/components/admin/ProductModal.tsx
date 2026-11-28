"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Flame,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Package,
  RefreshCw,
} from "lucide-react";
import {
  Product,
  Category,
  CATEGORIES,
  getCategories,
  addProduct,
  updateProduct,
} from "@backend/index";
import { CategoryModal } from "@/components/admin/CategoryModal";
import { uploadToImageKit } from "@/utils/imagekit";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(product);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    slug: "",
    category: CATEGORIES[0].name,
    categorySlug: CATEGORIES[0].slug,
    price: 399,
    originalPrice: 699,
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    burnTime: "50+ Hours",
    waxType: "100% Pure Organic Soy Wax",
    wickType: "Natural Braided Cotton Wick",
    fragranceNotes: {
      top: "Bergamot & Sandalwood",
      heart: "French Lavender",
      base: "Golden Amber & Cedar",
    },
    thumbnail: "",
    images: [],
    packagingUnit: "Single Piece (Jar/Tin)",
    piecesPerPack: 1,
    cartonCapacity: "48 pieces per master carton",
    unitWeight: "200g Soy Wax / 450g Gross",
    cartonWeight: "22.5 kg",
    cartonPrice: 7999,
    description: "",
    shortDescription: "",
    isWholesaleAvailable: true,
    wholesalePrice: 180,
    wholesaleMinQty: 24,
    rating: 4.9,
    reviewCount: 38,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dynamic categories on mount or open
  useEffect(() => {
    if (isOpen) {
      getCategories().then((cats) => {
        setCategoriesList(cats);
        // If adding fresh and category is not selected, set to first category
        if (!product && cats.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: prev.category || cats[0].name,
            categorySlug: prev.categorySlug || cats[0].slug,
          }));
        }
      });
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        fragranceNotes: product.fragranceNotes || {
          top: "",
          heart: "",
          base: "",
        },
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        category: CATEGORIES[0].name,
        categorySlug: CATEGORIES[0].slug,
        price: 399,
        originalPrice: 699,
        stock: 50,
        isAvailable: true,
        isFeatured: true,
        isBestSeller: false,
        burnTime: "50+ Hours",
        waxType: "100% Pure Organic Soy Wax",
        wickType: "Natural Braided Cotton Wick",
        fragranceNotes: {
          top: "Bergamot & Sandalwood",
          heart: "French Lavender",
          base: "Golden Amber & Cedar",
        },
        thumbnail: "",
        images: [],
        packagingUnit: "Single Piece (Jar/Tin)",
        piecesPerPack: 1,
        cartonCapacity: "48 pieces per master carton",
        unitWeight: "200g Soy Wax / 450g Gross",
        cartonWeight: "22.5 kg",
        cartonPrice: 7999,
        description:
          "Pure and sacred Pooja Samagri crafted at M/S RMPG Vedika Divine Home Industries with authentic Vedic botanicals, divine temple aroma, and pristine purity.",
        shortDescription: "Pure and sacred essentials for daily pooja, rituals, and festive celebrations.",
        isWholesaleAvailable: true,
        wholesalePrice: 180,
        wholesaleMinQty: 24,
        rating: 4.9,
        reviewCount: 38,
      });
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slug,
    }));
  };

  const handleCategoryChange = (slug: string) => {
    const list = categoriesList.length > 0 ? categoriesList : CATEGORIES;
    const cat = list.find((c) => c.slug === slug);
    if (cat) {
      setFormData((prev) => ({
        ...prev,
        category: cat.name,
        categorySlug: cat.slug,
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose a photo under 10MB.");
      return;
    }

    setUploadingImage(true);
    setError(null);
    try {
      const cleanFileName = `${(formData.slug || "candle").replace(/[^a-z0-9]+/g, "-")}_${Date.now()}.jpg`;
      const res = await uploadToImageKit(file, cleanFileName, "/vedika-divine/products");
      setFormData((prev) => ({
        ...prev,
        thumbnail: res.url,
        images: [res.url],
      }));
    } catch (err: any) {
      console.error("ImageKit upload error:", err);
      setError(err.message || "Failed to upload image to ImageKit CDN.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Product title is required.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Please specify a valid price.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        stock: Number(formData.stock || 0),
        wholesalePrice: Number(formData.wholesalePrice || 0),
        wholesaleMinQty: Number(formData.wholesaleMinQty || 12),
        packagingUnit: formData.packagingUnit || "Single Piece (Jar/Tin)",
        piecesPerPack: Number(formData.piecesPerPack || 1),
        cartonCapacity: formData.cartonCapacity || "",
        unitWeight: formData.unitWeight || "",
        cartonWeight: formData.cartonWeight || "",
        cartonPrice: Number(formData.cartonPrice || 0),
        thumbnail: formData.thumbnail || (formData.images && formData.images[0]) || "",
        images: formData.thumbnail ? [formData.thumbnail] : (formData.images && formData.images.length > 0 ? formData.images : []),
        rating: formData.rating || 4.9,
        reviewCount: formData.reviewCount || 25,
      };

      if (isEditing && product?.id) {
        await updateProduct(product.id, payload);
      } else {
        await addProduct(payload);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isEditing ? "Edit Product" : "Add New Product"}
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                M/S RMPG Vedika Divine Home Industries Catalog
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-stone-300">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              1. Basic Product Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Pure Bhimseni Camphor / Cow Ghee Diya Batti"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-stone-400">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(true)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                  >
                    + Create New Category
                  </button>
                </div>
                <select
                  value={formData.categorySlug}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500 cursor-pointer"
                >
                  {(categoriesList.length > 0 ? categoriesList : CATEGORIES).map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 font-mono text-[11px] focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="space-y-4 pt-2 border-t border-stone-800/80">
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              2. Pricing & Inventory
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-bold focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  MRP Price (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      originalPrice: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Stock Qty *
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.stock ?? 50}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stock: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Wholesale Rate (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.wholesalePrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wholesalePrice: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-bold focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Packaging & Master Carton Measurement */}
          <div className="space-y-4 pt-2 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                3. Packaging & Carton Measurement (पैकिंग एवं कार्टन माप)
              </h4>
              <span className="text-[10px] text-stone-500">
                Single Piece / Pack / Master Carton for Distributors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Packaging Unit (बिक्री की इकाई) *
                </label>
                <select
                  value={formData.packagingUnit || "Single Piece (Jar/Tin)"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      packagingUnit: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500 cursor-pointer"
                >
                  <option value="Single Piece (Jar/Tin)">Single Piece (Jar / Tin)</option>
                  <option value="Pack of 2 (Gift Set)">Pack of 2 (Gift Set)</option>
                  <option value="Pack of 4 (Aroma Set)">Pack of 4 (Aroma Set)</option>
                  <option value="Pack of 6 (Retail Box)">Pack of 6 (Retail Box)</option>
                  <option value="Pack of 12 (Festive Box)">Pack of 12 (Festive Box)</option>
                  <option value="50-Pack Tealights Box">50-Pack Tealights Box</option>
                  <option value="Master Carton (24 Pieces)">Master Carton (24 Pieces)</option>
                  <option value="Master Carton (48 Pieces)">Master Carton (48 Pieces)</option>
                  <option value="Master Carton (96 Pieces)">Master Carton (96 Pieces)</option>
                  <option value="Custom Bulk Pack">Custom Bulk Pack</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Master Carton Capacity
                </label>
                <input
                  type="text"
                  value={formData.cartonCapacity || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cartonCapacity: e.target.value,
                    }))
                  }
                  placeholder="e.g. 48 pieces per master carton"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Single Unit Weight
                </label>
                <input
                  type="text"
                  value={formData.unitWeight || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      unitWeight: e.target.value,
                    }))
                  }
                  placeholder="e.g. 200g Wax / 450g Gross"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Carton Gross Weight (डिलीवरी वजन)
                </label>
                <input
                  type="text"
                  value={formData.cartonWeight || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cartonWeight: e.target.value,
                    }))
                  }
                  placeholder="e.g. 22.5 kg per master carton"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Master Carton Price (₹ थोक कार्टन रेट)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.cartonPrice || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cartonPrice: Number(e.target.value),
                    }))
                  }
                  placeholder="e.g. 7999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-bold focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Min Wholesale Qty (MOQ)
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.wholesaleMinQty || 12}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wholesaleMinQty: Number(e.target.value),
                    }))
                  }
                  placeholder="e.g. 12 units or 1 carton"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="space-y-4 pt-2 border-t border-stone-800/80">
            <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              4. Product Specifications & Fragrance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Burn Time
                </label>
                <input
                  type="text"
                  value={formData.burnTime || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      burnTime: e.target.value,
                    }))
                  }
                  placeholder="e.g. 50+ Hours"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Wax Type
                </label>
                <input
                  type="text"
                  value={formData.waxType || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waxType: e.target.value,
                    }))
                  }
                  placeholder="e.g. 100% Pure Soy Wax"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Wick Type
                </label>
                <input
                  type="text"
                  value={formData.wickType || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wickType: e.target.value,
                    }))
                  }
                  placeholder="e.g. Natural Cotton Wick"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              {/* Fragrance Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Top Fragrance Note
                </label>
                <input
                  type="text"
                  value={formData.fragranceNotes?.top || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fragranceNotes: {
                        ...prev.fragranceNotes,
                        top: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Sweet Orange & Bergamot"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Heart Fragrance Note
                </label>
                <input
                  type="text"
                  value={formData.fragranceNotes?.heart || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fragranceNotes: {
                        ...prev.fragranceNotes,
                        heart: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. French Lavender & Jasmine"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                  Base Fragrance Note
                </label>
                <input
                  type="text"
                  value={formData.fragranceNotes?.base || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fragranceNotes: {
                        ...prev.fragranceNotes,
                        base: e.target.value,
                      },
                    }))
                  }
                  placeholder="e.g. Golden Amber & Cedarwood"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Candle Image (ImageKit CDN Direct Upload) */}
          <div className="space-y-3 pt-2 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                5. Product Image (ImageKit CDN Direct Upload)
              </h4>
              {formData.thumbnail && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: "",
                      images: [],
                    }))
                  }
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* If image is already uploaded/present */}
            {formData.thumbnail ? (
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-amber-500/40 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/60 bg-black shrink-0 shadow-md">
                  <img src={formData.thumbnail} alt="Product Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      ✓ ImageKit Active
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-stone-300 truncate mt-1">
                    {formData.thumbnail}
                  </p>
                </div>
                <label className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-stone-700 cursor-pointer shrink-0 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              /* When no image is uploaded */
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-950/50 cursor-pointer transition-colors shrink-0">
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading to ImageKit CDN...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Product Photo (ImageKit)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="w-full flex-1">
                    <input
                      type="url"
                      value={formData.thumbnail || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          thumbnail: e.target.value,
                          images: [e.target.value],
                        }))
                      }
                      placeholder="Or paste custom image URL (https://...)"
                      className="w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500 font-mono text-xs"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-500">
                  Upload your genuine product photograph. It will be uploaded straight to your ImageKit CDN account (/vedika-divine/products).
                </p>
              </div>
            )}
          </div>

          {/* Description & Flags */}
          <div className="space-y-4 pt-2 border-t border-stone-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-stone-400 mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="rounded-md border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-stone-300 font-medium">
                  Feature on Homepage
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller ?? false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isBestSeller: e.target.checked,
                    }))
                  }
                  className="rounded-md border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-stone-300 font-medium">
                  Mark as Best Seller
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isWholesaleAvailable ?? true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isWholesaleAvailable: e.target.checked,
                    }))
                  }
                  className="rounded-md border-stone-700 bg-stone-950 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-stone-300 font-medium">
                  Available for Wholesale Carton Dealers
                </span>
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-stone-800 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Add to Catalog"}
            </button>
          </div>
        </form>
      </div>

      {/* Embedded CategoryModal for seamless category creation right inside product form */}
      <CategoryModal
        category={null}
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={(newCat) => {
          setCategoriesList((prev) => [...prev.filter((c) => c.slug !== newCat.slug), newCat]);
          setFormData((prev) => ({
            ...prev,
            category: newCat.name,
            categorySlug: newCat.slug,
          }));
        }}
      />
    </div>
  );
};
