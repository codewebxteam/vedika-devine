"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Flame,
  MessageSquare,
  Building2,
  Wind,
  Award,
} from "lucide-react";
import {
  Product,
  getProductById,
  getFeaturedProducts,
  formatCurrency,
  getProductReviews,
  addReview,
  Review,
  APP_CONFIG,
} from "@backend/index";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCard } from "@/components/product/ProductCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const fetchItem = async () => {
      setLoading(true);
      const data = await getProductById(productId);
      if (data) {
        setProduct(data);
        setSelectedImage(data.images?.[0] || data.thumbnail);
      }
      const related = await getFeaturedProducts(4);
      setRelatedProducts(related.filter((p) => p.id !== productId));

      const revs = await getProductReviews(productId);
      setReviews(revs);

      setLoading(false);
    };

    fetchItem();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const created = await addReview({
        productId: product.id,
        userId: user ? user.uid : "guest-customer",
        userName: user?.displayName || "Verified Customer",
        rating: newRating,
        comment: newComment.trim(),
        verifiedPurchase: true,
        createdAt: Date.now(),
      });
      setReviews([created, ...reviews]);
      setNewComment("");
    } catch (e) {
      console.warn("Could not post review:", e);
    }
    setSubmittingReview(false);
  };

  if (loading) {
    return (
      <div className="py-28 text-center space-y-4 bg-[#FFFDF9] min-h-screen">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-serif text-sm font-semibold text-black">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4 bg-[#FFFDF9] min-h-screen">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <Flame className="w-8 h-8 fill-amber-700" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-black mb-2">Product Not Found</h2>
        <p className="text-xs sm:text-sm text-stone-600 mb-6">
          The requested sacred item could not be retrieved. It may have been archived.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 rounded-full bg-black text-white font-semibold text-xs hover:bg-stone-900 shadow-md"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="bg-[#FFFDF9] min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Added Alert Banner */}
      {addedAlert && (
        <div className="fixed top-24 right-4 z-50 bg-black text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="w-7 h-7 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-300">Added to Your Bag!</p>
            <p className="text-[10px] text-stone-300">{product.name} (x{quantity})</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-600 mb-8 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-amber-800 shrink-0">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link href="/shop" className="hover:text-amber-800 shrink-0">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-amber-800 shrink-0">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-black font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Grid (Left Gallery, Right Specs & Purchase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-amber-200 shadow-xl group">
              {/* Soft Amber Glow behind Image */}
              <div className="absolute inset-0 bg-radial from-amber-300/15 via-transparent to-transparent pointer-events-none" />

              <img
                src={selectedImage || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-amber-500 text-black text-xs font-extrabold px-3.5 py-1 rounded-full shadow-lg tracking-wider">
                  {product.discountPercentage}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/95 text-stone-700 hover:text-rose-600 shadow-md backdrop-blur-md transition-all cursor-pointer border border-amber-200"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-600 text-rose-600" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImage === img
                        ? "border-amber-500 ring-2 ring-amber-400/40 scale-105 shadow-md"
                        : "border-amber-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-black bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
                  {product.category}
                </span>
                {product.burnTime && (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {product.burnTime} Clean Burn
                  </span>
                )}
                <span className="text-[11px] font-bold text-black bg-white border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  100% Plant Soy Wax
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-black leading-snug tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-black ml-1.5">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-600 font-medium">
                  {product.reviewCount + reviews.length} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-sm space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-serif text-black">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Packaging & Wholesale Carton Specs */}
              <div className="p-3.5 rounded-2xl bg-[#0C0A09] text-white border border-amber-900/60 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold text-amber-300">
                      📦 Packaging: {product.packagingUnit || "Single Piece (Jar/Tin)"}
                    </span>
                  </div>
                  <Link
                    href="/wholesale"
                    className="text-amber-300 hover:text-white font-bold underline shrink-0 text-[11px]"
                  >
                    Wholesale Inquiry →
                  </Link>
                </div>
                {(product.cartonCapacity || product.unitWeight || product.cartonPrice) && (
                  <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-300 grid grid-cols-2 gap-2">
                    {product.cartonCapacity && (
                      <div>
                        <span className="text-stone-500 block text-[10px]">Master Carton:</span>
                        <span className="font-medium text-stone-200">{product.cartonCapacity}</span>
                      </div>
                    )}
                    {product.unitWeight && (
                      <div>
                        <span className="text-stone-500 block text-[10px]">Unit Weight:</span>
                        <span className="font-medium text-stone-200">{product.unitWeight}</span>
                      </div>
                    )}
                    {product.cartonPrice && (
                      <div className="col-span-2 text-amber-400 font-bold">
                        Carton Bulk Rate: ₹{product.cartonPrice} (Dealer Margin 45-55%)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="inline-flex items-center border border-amber-300 rounded-full bg-white shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-stone-600 hover:text-black cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-black min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-stone-600 hover:text-black cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {!product.isAvailable || (product.stock ?? 0) === 0 ? (
                  <button
                    disabled
                    className="sm:col-span-2 px-6 py-4 rounded-full bg-stone-200 text-stone-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed border border-stone-300"
                  >
                    <span>Currently Out of Stock (स्टॉक समाप्त)</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-4 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer border border-black"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="px-6 py-4 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Flame className="w-4 h-4 fill-black" />
                      <span>Buy Now (Instant Checkout)</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Reassurance Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-amber-200/70 text-center text-xs">
              <div className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-2xs">
                <Truck className="w-5 h-5 text-amber-700 mx-auto mb-1" />
                <p className="font-bold text-black text-[11px]">Free Shipping</p>
                <p className="text-[9px] text-stone-500">Above ₹999</p>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-amber-700 mx-auto mb-1" />
                <p className="font-bold text-black text-[11px]">Zero Paraffin</p>
                <p className="text-[9px] text-stone-500">100% Plant Wax</p>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-2xs">
                <Award className="w-5 h-5 text-amber-700 mx-auto mb-1" />
                <p className="font-bold text-black text-[11px]">Hand-Poured</p>
                <p className="text-[9px] text-stone-500">Kushinagar Unit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Formulation Tabs & Olfactory Breakdown */}
        <div className="mt-16 sm:mt-24 border-t border-amber-200/70 pt-12 space-y-12">
          {/* Scent Pyramid & Notes Breakdown */}
          {product.fragranceNotes && (
            <div className="bg-[#0C0A09] text-white p-8 sm:p-12 rounded-3xl border border-amber-900/60 shadow-xl space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                  <Wind className="w-4 h-4" />
                  Olfactory Fragrance Architecture
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Scent Profile & Ambient Notes
                </h3>
                <p className="text-xs text-stone-400">
                  Formulated with high 8-10% pure essential oil load for strong cold and hot fragrance throw.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-stone-900 border border-amber-900/50 text-center space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Top Notes (Initial 15 mins)
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {product.fragranceNotes.top || "Citrus Zest & Bergamot Blossom"}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    The crisp opening aroma that greets you immediately upon lighting.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-amber-500/50 text-center space-y-2 shadow-md">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                    Heart Notes (Core Aroma)
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {product.fragranceNotes.heart || "Bourbon Vanilla & Night Jasmine"}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    The true aromatic body that defines the room ambience for hours.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900 border border-amber-900/50 text-center space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Base Notes (Lingering Warmth)
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {product.fragranceNotes.base || "Mysore Sandalwood & Amber Musk"}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Deep soothing base that lingers long after extinguishing the flame.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description & Technical Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-xl text-black">
                About This Sacred Offering
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {product.description ||
                  "Crafted with devotion at Turkpatti Bazar, Kushinagar, this sacred offering features authentic Vedic ingredients and pure botanicals for auspicious temple and home devotion."}
              </p>

              <div className="pt-4 border-t border-amber-100">
                <h4 className="font-serif font-bold text-sm text-black mb-2">
                  Artisanal Burning Tips
                </h4>
                <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                  <li>Trim wick to 1/4 inch before each lighting for an even burn.</li>
                  <li>Allow wax to melt completely to the jar edges on first burn (2-3 hours).</li>
                  <li>Never burn for more than 4 consecutive hours.</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-amber-200 shadow-sm space-y-3">
              <h3 className="font-serif font-bold text-lg text-black mb-4 border-b border-amber-100 pb-2">
                Product Specifications
              </h3>
              <div className="divide-y divide-amber-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500 font-medium">Wax Formulation</span>
                  <span className="text-black font-bold">100% Plant Soy Wax</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500 font-medium">Burn Time</span>
                  <span className="text-black font-bold">{product.burnTime || "50+ Hours"}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500 font-medium">Wick Type</span>
                  <span className="text-black font-bold">FSC Wood / Cotton Lead-Free</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500 font-medium">Jar Vessel</span>
                  <span className="text-black font-bold">Heat-Resistant Amber Glass</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-stone-500 font-medium">Manufacturing Origin</span>
                  <span className="text-black font-bold">Kushinagar (UP), India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Add Review Section */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-amber-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-amber-200 gap-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-black">
                  Customer Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real experiences from customers across India.
                </p>
              </div>

              <div className="flex items-center gap-2 text-amber-500">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="font-serif font-bold text-xl text-black">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <h4 className="font-serif font-bold text-sm text-black">
                Share Your Sacred Experience
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-medium">Rating:</span>
                <div className="flex gap-1 text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewRating(s)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${s <= newRating ? "fill-amber-400" : "text-stone-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="How did the fragrance and crackling wick feel in your home?"
                rows={3}
                required
                className="w-full p-3.5 rounded-xl border border-amber-300 text-xs text-black bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-stone-900 text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl border border-amber-100 bg-[#FFFDF9] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                        {rev.userName[0].toUpperCase()}
                      </div>
                      <p className="font-bold text-xs text-black">{rev.userName}</p>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400" : "text-stone-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-normal">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    You May Also Love
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-black mt-1">
                    Complementary Scent Pairings
                  </h3>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-bold text-amber-700 hover:text-amber-900 underline"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} theme="light" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
