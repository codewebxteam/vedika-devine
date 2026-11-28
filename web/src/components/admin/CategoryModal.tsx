"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Layers,
  Upload,
  AlertCircle,
  RefreshCw,
  Hash,
} from "lucide-react";
import { Category, addCategory, updateCategory } from "@backend/index";
import { uploadToImageKit } from "@/utils/imagekit";

interface CategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (cat: Category) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  isOpen,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDisplayOrder(category.displayOrder ?? 1);
      setImage(category.image || "");
    } else {
      setName("");
      setDisplayOrder(1);
      setImage("");
    }
    setError(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose an image under 10MB.");
      return;
    }

    setUploadingImage(true);
    setError(null);
    try {
      const cleanSlug = (name || "category")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const cleanFileName = `${cleanSlug || "category"}_${Date.now()}.jpg`;
      const res = await uploadToImageKit(file, cleanFileName, "/vedika-divine/categories");
      setImage(res.url);
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
    if (!name.trim()) {
      setError("Category Name is required.");
      return;
    }

    // Auto-generate clean slug from category name
    const cleanSlug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setLoading(true);
    setError(null);

    try {
      const payload: Omit<Category, "id"> = {
        name: name.trim(),
        slug: cleanSlug,
        displayOrder: Number(displayOrder || 1),
        image: image.trim(),
        description: category?.description || "",
        icon: category?.icon || "Sparkles",
      };

      if (isEditing && category?.id) {
        await updateCategory(category.id, payload);
        onSaved({ id: category.id, ...payload });
      } else {
        const newId = await addCategory(payload);
        onSaved({ id: newId, ...payload });
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isEditing ? "Edit Category" : "Create New Category"}
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Simple 3-field category setup (Name, Position & Image)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Only 3 Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-stone-300">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Field 1: Category Name */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              1. Category Name (श्रेणी का नाम) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bhimseni Camphor, Pure Ghee Diyas, Dhoop & Agarbatti..."
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-hidden focus:border-amber-500 text-sm font-medium"
            />
          </div>

          {/* Field 2: Position No */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Position No (क्रम संख्या / Display Order)</span>
            </label>
            <input
              type="number"
              min={1}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              placeholder="1"
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-bold focus:outline-hidden focus:border-amber-500 text-sm"
            />
            <p className="text-[10px] text-stone-500 mt-1">
              Storefront और मेनू में किस नंबर पर यह श्रेणी पहले दिखेगी (1 = सबसे पहले)।
            </p>
          </div>

          {/* Field 3: 1 Category Image */}
          <div className="space-y-2.5 pt-2 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-white">
                3. Category Image (कवर फोटो - ImageKit CDN)
              </label>
              {image && (
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* If Image is Uploaded */}
            {image ? (
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-amber-500/40 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/60 bg-black shrink-0 shadow-md">
                  <img src={image} alt="Category Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    ✓ Image Uploaded
                  </span>
                  <p className="text-[11px] font-mono text-stone-300 truncate mt-1">
                    {image}
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
              /* When No Image is Selected */
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
                        <span>Upload Image (ImageKit)</span>
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
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full px-3.5 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 font-mono text-xs focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-500">
                  Select 1 photo from your device (JPG, PNG, WebP). It will upload directly to ImageKit CDN.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold uppercase tracking-wider shadow-lg shadow-amber-950/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
