"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Package,
  Flame,
  Truck,
  Phone,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Store,
  Plus,
  Minus,
  Trash2,
  Coins,
  Percent,
  ShoppingBag,
  Receipt,
  Search,
  Share2,
  Send,
  MapPin,
  Calendar,
  Wallet,
  Banknote,
  TrendingUp,
  Eye,
  X,
  ChevronRight,
  Filter,
  Check,
  BadgeAlert,
  ArrowRight,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Product,
  Order,
  SavedShop,
  getProducts,
  formatCurrency,
  formatDate,
  APP_CONFIG,
  submitWholesaleInquiry,
  createDistributorAssistedOrder,
  getDistributorAssistedOrders,
  getDistributorSavedShops,
  deleteDistributorSavedShop,
  upsertDistributorSavedShop,
} from "@backend/index";

export default function DealerDashboardPage() {
  const router = useRouter();
  const { user, profile, isDealer, isAdmin, loading, logout } = useAuth();

  // Active Tab:
  // "overview"    -> Executive Summary, Analytics & Quick Stats
  // "pos"         -> Rapid Dukan Order Booking Engine (Field POS)
  // "shops"       -> My Retail Shops Network & 1-Click Reorders
  // "orders"      -> My Dukan Orders & Consignment Tracking
  // "commission"  -> Commission Ledger & Admin Payout Records
  // "wholesale"   -> Factory Master Cartons B2B Catalog
  const [activeTab, setActiveTab] = useState<
    "overview" | "pos" | "shops" | "orders" | "commission" | "wholesale"
  >("overview");

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [assistedOrders, setAssistedOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Saved Shops Directory State
  const [savedShops, setSavedShops] = useState<SavedShop[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [shopSearchQuery, setShopSearchQuery] = useState("");
  const [selectedSavedShopId, setSelectedSavedShopId] = useState("");
  const [reorderNotification, setReorderNotification] = useState<string | null>(null);
  const [deletingShopId, setDeletingShopId] = useState<string | null>(null);

  // POS Form State
  const [shopName, setShopName] = useState("");
  const [shopOwnerName, setShopOwnerName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopStreet, setShopStreet] = useState("");
  const [shopCity, setShopCity] = useState("");
  const [shopState, setShopState] = useState("Uttar Pradesh");
  const [shopPincode, setShopPincode] = useState("");
  const [distributorNotes, setDistributorNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash on Delivery" | "UPI / Online Payment">("Cash on Delivery");

  // POS Basket (productId -> quantity pieces)
  const [basket, setBasket] = useState<{ [productId: string]: number }>({});
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");

  // POS Submit & Success State
  const [bookingOrder, setBookingOrder] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [lastBookedOrder, setLastBookedOrder] = useState<Order | null>(null);

  // Order Details Modal for Dealer
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  // Filters for Orders Tab
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [orderCommissionFilter, setOrderCommissionFilter] = useState("All");

  // Wholesale Catalog Modal State
  const [selectedCarton, setSelectedCarton] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [cartonQty, setCartonQty] = useState(10);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Wholesale Mandatory Shop Destination State
  const [wsSelectedShopId, setWsSelectedShopId] = useState("");
  const [wsShopName, setWsShopName] = useState("");
  const [wsContactPerson, setWsContactPerson] = useState("");
  const [wsPhone, setWsPhone] = useState("");
  const [wsStreet, setWsStreet] = useState("");
  const [wsCity, setWsCity] = useState("");
  const [wsPincode, setWsPincode] = useState("");
  const [wsNotes, setWsNotes] = useState("");
  const [wsError, setWsError] = useState<string | null>(null);

  const commissionRate = profile?.dealerInfo?.commissionRate ?? 10;
  const businessName =
    profile?.dealerInfo?.businessName || profile?.displayName || "Authorized Distributor";
  const contactPerson = profile?.dealerInfo?.contactPerson || profile?.displayName || "";
  const phone = profile?.dealerInfo?.phone || profile?.phoneNumber || "";
  const city = profile?.dealerInfo?.city || "India";
  const territory = profile?.dealerInfo?.assignedTerritory || "Purvanchal Region";

  // Load products & distributor orders
  useEffect(() => {
    const loadData = async () => {
      setLoadingProducts(true);
      try {
        const prodData = await getProducts();
        setProducts(prodData);
      } catch (e) {
        console.warn("Error loading products:", e);
      }
      setLoadingProducts(false);
    };
    loadData();
  }, []);

  const fetchDistributorOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const ords = await getDistributorAssistedOrders(user.uid);
      setAssistedOrders(ords);
    } catch (e) {
      console.warn("Error loading distributor orders:", e);
    }
    setLoadingOrders(false);
  };

  const fetchSavedShops = async () => {
    if (!user) return;
    setLoadingShops(true);
    try {
      const list = await getDistributorSavedShops(user.uid);
      setSavedShops(list);
    } catch (e) {
      console.warn("Error loading saved shops:", e);
    }
    setLoadingShops(false);
  };

  useEffect(() => {
    if (user && (isDealer || isAdmin)) {
      fetchDistributorOrders();
      fetchSavedShops();
    }
  }, [user, isDealer, isAdmin]);

  // Repeat Last Order for a Saved Shop
  const handleRepeatLastOrder = (shop: SavedShop) => {
    setSelectedSavedShopId(shop.id);
    setShopName(shop.shopName);
    setShopOwnerName(shop.shopOwnerName);
    setShopPhone(shop.shopPhone);
    setShopStreet(shop.street);
    setShopCity(shop.city);
    setShopState(shop.state || "Uttar Pradesh");
    setShopPincode(shop.pincode);
    setDistributorNotes(shop.notes || "");

    if (shop.lastOrderItems && shop.lastOrderItems.length > 0) {
      const newBasket: { [productId: string]: number } = {};
      shop.lastOrderItems.forEach((it) => {
        if (it.productId) {
          newBasket[it.productId] = (newBasket[it.productId] || 0) + (it.quantity || 1);
        }
      });
      setBasket(newBasket);
      setReorderNotification(
        `"${shop.shopName}" ka pichla order (${shop.lastOrderItems.length} items) cart me load ho gaya hai! Kripya items check karke Confirm karein.`
      );
    } else {
      setBasket({});
      setReorderNotification(
        `"${shop.shopName}" select ho gayi hai! Kripya items basket me add karein.`
      );
    }

    setActiveTab("pos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Start fresh order for a Saved Shop
  const handleNewOrderForShop = (shop: SavedShop) => {
    setSelectedSavedShopId(shop.id);
    setShopName(shop.shopName);
    setShopOwnerName(shop.shopOwnerName);
    setShopPhone(shop.shopPhone);
    setShopStreet(shop.street);
    setShopCity(shop.city);
    setShopState(shop.state || "Uttar Pradesh");
    setShopPincode(shop.pincode);
    setDistributorNotes(shop.notes || "");
    setBasket({});
    setReorderNotification(
      `"${shop.shopName}" select ho gayi hai! Kripya naye items basket me add karein.`
    );
    setActiveTab("pos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Shop from Directory
  const handleDeleteSavedShop = async (shopId: string, name: string) => {
    if (!confirm(`Kya aap "${name}" ko apni saved shops list se delete karna chahte hain?`)) return;
    setDeletingShopId(shopId);
    try {
      await deleteDistributorSavedShop(shopId);
      await fetchSavedShops();
    } catch (err: any) {
      alert(`Shop delete karne me error: ${err.message}`);
    }
    setDeletingShopId(null);
  };

  // Open Wholesale Modal & pre-populate destination details
  const handleOpenWholesaleModal = (product: Product) => {
    setSelectedCarton(product);
    setWsError(null);
    if (savedShops.length > 0) {
      const first = savedShops[0];
      setWsSelectedShopId(first.id);
      setWsShopName(first.shopName);
      setWsContactPerson(first.shopOwnerName);
      setWsPhone(first.shopPhone);
      setWsStreet(first.street);
      setWsCity(first.city);
      setWsPincode(first.pincode);
    } else {
      setWsSelectedShopId("");
      setWsShopName(businessName);
      setWsContactPerson(contactPerson || businessName);
      setWsPhone(phone);
      setWsStreet("");
      setWsCity(city);
      setWsPincode("");
    }
  };

  // Derived Analytics Metrics
  const totalSalesDelivered = useMemo(
    () => assistedOrders.reduce((sum, o) => sum + (o.total || 0), 0),
    [assistedOrders]
  );

  const totalCommissionEarned = useMemo(
    () => assistedOrders.reduce((sum, o) => sum + (o.partnerCommissionAmount || 0), 0),
    [assistedOrders]
  );

  const commissionPaidByAdmin = useMemo(
    () =>
      assistedOrders
        .filter((o) => o.commissionStatus === "Paid")
        .reduce((sum, o) => sum + (o.partnerCommissionAmount || 0), 0),
    [assistedOrders]
  );

  const commissionApprovedByAdmin = useMemo(
    () =>
      assistedOrders
        .filter((o) => o.commissionStatus === "Approved")
        .reduce((sum, o) => sum + (o.partnerCommissionAmount || 0), 0),
    [assistedOrders]
  );

  const commissionPendingAdmin = useMemo(
    () =>
      assistedOrders
        .filter((o) => !o.commissionStatus || o.commissionStatus === "Pending")
        .reduce((sum, o) => sum + (o.partnerCommissionAmount || 0), 0),
    [assistedOrders]
  );

  const totalPiecesBooked = useMemo(
    () =>
      assistedOrders.reduce(
        (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
        0
      ),
    [assistedOrders]
  );

  // Extract Recent Unique Shops for 1-Tap Auto-Fill
  const recentShops = useMemo(() => {
    const map = new Map<string, { name: string; owner: string; phone: string; street: string; city: string; state: string; pincode: string }>();
    assistedOrders.forEach((o) => {
      if (o.shopName && !map.has(o.shopName)) {
        map.set(o.shopName, {
          name: o.shopName,
          owner: o.shopOwnerName || "",
          phone: o.shopPhone || "",
          street: o.shippingAddress?.street || "",
          city: o.shippingAddress?.city || "",
          state: o.shippingAddress?.state || "Uttar Pradesh",
          pincode: o.shippingAddress?.pincode || "",
        });
      }
    });
    return Array.from(map.values()).slice(0, 4);
  }, [assistedOrders]);

  const handleApplyRecentShop = (shop: typeof recentShops[0]) => {
    setShopName(shop.name);
    setShopOwnerName(shop.owner);
    setShopPhone(shop.phone);
    setShopStreet(shop.street);
    setShopCity(shop.city);
    setShopState(shop.state);
    setShopPincode(shop.pincode);
  };

  // Basket Handlers
  const handleQuantityChange = (productId: string, delta: number) => {
    setBasket((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleAddCarton = (productId: string, cartonMultiplier = 24) => {
    handleQuantityChange(productId, cartonMultiplier);
  };

  // Compute Basket Totals
  const basketItems = Object.entries(basket)
    .map(([id, qty]) => {
      const prod = products.find((p) => p.id === id);
      if (!prod) return null;
      return {
        product: prod,
        quantity: qty,
        lineTotal: prod.price * qty,
      };
    })
    .filter(Boolean) as { product: Product; quantity: number; lineTotal: number }[];

  const basketSubtotal = basketItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalBasketPieces = basketItems.reduce((sum, item) => sum + item.quantity, 0);
  const potentialCommission = Math.round((basketSubtotal * commissionRate) / 100);

  // Submit Retail POS Order
  const handleBookShopOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (basketItems.length === 0) {
      setBookingError("Kripya kam se kam ek product ya carton select karein.");
      return;
    }
    if (
      !shopName.trim() ||
      !shopOwnerName.trim() ||
      !shopPhone.trim() ||
      !shopStreet.trim() ||
      !shopCity.trim() ||
      !shopPincode.trim()
    ) {
      setBookingError("Kripya Dukan ka Naam, Dukandar ka Naam, Phone aur Delivery Address pura bharein.");
      return;
    }

    setBookingOrder(true);
    try {
      const formattedItems = basketItems.map((item) => ({
        productId: item.product.id || "",
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.thumbnail || item.product.images?.[0] || "/images/logo.png",
      }));

      const newOrder = await createDistributorAssistedOrder({
        distributorId: user?.uid || "distributor",
        distributorName: contactPerson || profile?.displayName || "Distributor",
        distributorBusiness: businessName,
        distributorPhone: phone,
        shopName: shopName.trim(),
        shopOwnerName: shopOwnerName.trim(),
        shopPhone: shopPhone.trim(),
        shopAddress: {
          fullName: `${shopName.trim()} (${shopOwnerName.trim()})`,
          phone: shopPhone.trim(),
          street: shopStreet.trim(),
          city: shopCity.trim(),
          state: shopState.trim(),
          pincode: shopPincode.trim(),
        },
        items: formattedItems,
        subtotal: basketSubtotal,
        shippingFee: 0,
        discount: 0,
        total: basketSubtotal,
        paymentMethod,
        commissionRate,
        distributorNotes: distributorNotes.trim(),
      });

      setLastBookedOrder(newOrder);
      // Reset form and basket
      setBasket({});
      setShopName("");
      setShopOwnerName("");
      setShopPhone("");
      setShopStreet("");
      setShopCity("");
      setShopPincode("");
      setDistributorNotes("");
      // Refresh history & saved directory
      fetchDistributorOrders();
      fetchSavedShops();
    } catch (err: any) {
      console.warn("Order booking error:", err);
      setBookingError(`Order booking error: ${err.message || "Failed to create order"}`);
    }
    setBookingOrder(false);
  };

  // Wholesale Inquiries with Mandatory Shop Delivery Destination
  const handlePlaceWholesaleOrder = async (product: Product) => {
    setWsError(null);
    if (
      !wsShopName.trim() ||
      !wsContactPerson.trim() ||
      !wsPhone.trim() ||
      !wsStreet.trim() ||
      !wsCity.trim() ||
      !wsPincode.trim()
    ) {
      setWsError("Kripya Factory Maal Dispatch ke liye Dukan / Godown ka pura Delivery Address bharein.");
      return;
    }

    setSubmittingOrder(true);
    setOrderSuccess(null);
    try {
      const wholesaleRate = product.wholesalePrice || Math.round(product.price * 0.55);
      const totalAmount = wholesaleRate * 24 * cartonQty;

      await submitWholesaleInquiry({
        businessName,
        contactPerson: wsContactPerson.trim(),
        phone: wsPhone.trim(),
        city: wsCity.trim(),
        estimatedQuantity: `${cartonQty} Master Cartons (${product.name} - ${cartonQty * 24} pcs)`,
        candleTypesNeeded: [product.name, product.category],
        message: `FACTORY DISPATCH ORDER: ${cartonQty} cartons (${cartonQty * 24} pcs) of "${product.name}" at ₹${wholesaleRate}/pc.
Total Consignment Value: ${formatCurrency(totalAmount)}.
DELIVERY DISPATCH DESTINATION:
Shop / Firm: ${wsShopName.trim()}
Owner / Contact: ${wsContactPerson.trim()}
Phone / WhatsApp: ${wsPhone.trim()}
Address: ${wsStreet.trim()}, ${wsCity.trim()} - ${wsPincode.trim()}
Dispatch Instructions: ${wsNotes.trim() || "Priority direct shipment from Kushinagar manufacturing unit."}`,
      });

      // Auto-save destination shop to distributor's saved directory
      try {
        await upsertDistributorSavedShop({
          distributorId: user?.uid || "distributor",
          shopName: wsShopName.trim(),
          shopOwnerName: wsContactPerson.trim(),
          shopPhone: wsPhone.trim(),
          street: wsStreet.trim(),
          city: wsCity.trim(),
          pincode: wsPincode.trim(),
          notes: wsNotes.trim(),
        });
        fetchSavedShops();
      } catch (e) {
        console.warn("Wholesale shop auto-save note:", e);
      }

      setOrderSuccess(
        `Wholesale order for ${cartonQty} cartons of "${product.name}" received for dispatch to ${wsShopName}! Factory production dispatch manager will contact on ${wsPhone}.`
      );
      setSelectedCarton(null);
    } catch (err: any) {
      setWsError(`Order error: ${err.message}`);
    }
    setSubmittingOrder(false);
  };

  // Filtered Orders for the Orders Tab
  const filteredOrders = useMemo(() => {
    return assistedOrders.filter((o) => {
      const q = orderSearchQuery.toLowerCase();
      const matchSearch =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.shopName?.toLowerCase().includes(q) ||
        o.shopOwnerName?.toLowerCase().includes(q) ||
        o.shopPhone?.includes(q) ||
        o.shippingAddress?.city?.toLowerCase().includes(q);

      const matchStatus =
        orderStatusFilter === "All" || o.status === orderStatusFilter;

      const matchCommission =
        orderCommissionFilter === "All" ||
        (orderCommissionFilter === "Pending" && (!o.commissionStatus || o.commissionStatus === "Pending")) ||
        o.commissionStatus === orderCommissionFilter;

      return matchSearch && matchStatus && matchCommission;
    });
  }, [assistedOrders, orderSearchQuery, orderStatusFilter, orderCommissionFilter]);

  // Filtered Saved Shops for the Shops Tab
  const filteredSavedShops = useMemo(() => {
    const q = shopSearchQuery.toLowerCase().trim();
    if (!q) return savedShops;
    return savedShops.filter(
      (s) =>
        s.shopName?.toLowerCase().includes(q) ||
        s.shopOwnerName?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.shopPhone?.includes(q) ||
        s.pincode?.includes(q)
    );
  }, [savedShops, shopSearchQuery]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-300">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-bold tracking-widest text-stone-400">
            Verifying Dealer Partner Session...
          </p>
        </div>
      </div>
    );
  }

  // Guard: If not logged in or not dealer/admin
  if (!user || (!isDealer && !isAdmin)) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Authorized Dealer Access Required
            </h2>
            <p className="text-xs text-stone-400 mt-2">
              This portal is exclusively reserved for approved wholesale dealers & retail partners.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <Link
              href="/dealer/login"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Dealer Login
            </Link>
            <Link
              href="/dealer/register"
              className="w-full py-2.5 rounded-2xl bg-stone-950 border border-amber-800 text-amber-300 hover:bg-stone-800 text-xs font-semibold transition-colors"
            >
              Apply to Become a Partner
            </Link>
            <Link
              href="/"
              className="text-[11px] text-stone-500 hover:text-stone-300 transition-colors pt-2"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const whatsappProductionUrl = `https://wa.me/918874205655?text=${encodeURIComponent(
    `Namaste Factory Dispatch, this is ${businessName} (Approved Partner). I have a query regarding our retail shop consignments.`
  )}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-600 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. TOP EXECUTIVE HEADER BAR                                               */}
      {/* ========================================================================= */}
      <header className="bg-stone-900/95 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/images/logo.png"
            alt="Vedika Divine Logo"
            className="h-9 sm:h-10 w-auto object-contain rounded-xl bg-white/10 p-1 border border-stone-700/80 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-xs sm:text-sm tracking-wide truncate">
                VEDIKA DEALER CONSOLE
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Partner</span>
              </span>
            </div>
            <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase truncate">
              {businessName} • {city} • Territory: <span className="text-stone-200">{territory}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-stone-400">Commission Rate:</span>
            <strong className="text-amber-400 font-mono text-sm">{commissionRate}%</strong>
          </div>

          <a
            href={whatsappProductionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Factory Support</span>
          </a>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION BAR (TABS)                                                  */}
      {/* ========================================================================= */}
      <div className="bg-[#141210] border-b border-stone-800 px-4 sm:px-8 py-2.5 overflow-x-auto scrollbar-none sticky top-[57px] z-30 flex items-center gap-2 sm:gap-3 select-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "overview"
              ? "bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("pos")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "pos"
              ? "bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Quick Shop Order (POS)</span>
        </button>

        <button
          onClick={() => setActiveTab("shops")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "shops"
              ? "bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>My Retail Shops ({savedShops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "orders"
              ? "bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>My Shop Orders ({assistedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("commission")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "commission"
              ? "bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Commission & Payouts ({formatCurrency(totalCommissionEarned)})</span>
        </button>

        <button
          onClick={() => setActiveTab("wholesale")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "wholesale"
              ? "bg-linear-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20"
              : "bg-stone-900 text-stone-300 hover:text-white border border-stone-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Factory Master Cartons</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT AREA                                            */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* VIEW 1: EXECUTIVE DASHBOARD OVERVIEW                                      */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Welcome Card */}
            <div className="bg-linear-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-600/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase tracking-widest inline-block">
                  Distributor Executive Dashboard
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Namaste, {contactPerson || businessName}!
                </h1>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  Aapka official retail booking & commission control room. Local dukano par baithkar direct factory order lagayein, consignment dispatch track karein aur admin dwara diya gaya commision payout monitor karein.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
                <button
                  onClick={() => setActiveTab("pos")}
                  className="px-5 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Store className="w-4 h-4" />
                  <span>Book Shop Order Now</span>
                </button>

                <button
                  onClick={() => setActiveTab("shops")}
                  className="px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-amber-600/50 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>My Shops ({savedShops.length})</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics Cards (Just like Admin Console) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Sales */}
              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Total Dukan Sales Value
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {formatCurrency(totalSalesDelivered)}
                </p>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>From <strong>{assistedOrders.length}</strong> retail consignments</span>
                </div>
              </div>

              {/* Card 2: Total Commission Earned */}
              <div className="p-5 rounded-3xl bg-linear-to-br from-stone-900 to-amber-950/50 border border-amber-600/40 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Total Commission Earned
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
                  {formatCurrency(totalCommissionEarned)}
                </p>
                <div className="text-[11px] text-stone-300 flex items-center gap-1.5 pt-1">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fixed Rate: <strong>{commissionRate}%</strong> set by Admin</span>
                </div>
              </div>

              {/* Card 3: Paid by Admin */}
              <div className="p-5 rounded-3xl bg-stone-900 border border-emerald-900/40 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Paid by Admin (Transferred)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                  {formatCurrency(commissionPaidByAdmin)}
                </p>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transferred to your Bank / UPI</span>
                </div>
              </div>

              {/* Card 4: Pending / Scheduled Payout */}
              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Pending / Scheduled Payout
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {formatCurrency(commissionPendingAdmin + commissionApprovedByAdmin)}
                </p>
                <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                  <span>Approved: <strong className="text-amber-400">₹{commissionApprovedByAdmin}</strong></span>
                  <span>Transit: <strong className="text-stone-300">₹{commissionPendingAdmin}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Dukan Orders Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Recent 5 Dukan Orders */}
              <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-white text-base">Recent Field Bookings</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({assistedOrders.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {assistedOrders.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 space-y-2">
                    <Store className="w-10 h-10 mx-auto text-stone-700" />
                    <p className="font-semibold text-stone-300 text-sm">Abhi tak koi dukan order nahi laga hai</p>
                    <p className="text-xs text-stone-500">
                      &ldquo;Quick Shop Order (POS)&rdquo; se kisi bhi dukan ka order place karein.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assistedOrders.slice(0, 5).map((ord) => {
                      const cleanPhone = (ord.shopPhone || "").replace(/[^0-9]/g, "");
                      const whatsappMsg = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                        `Namaste ${ord.shopOwnerName}, aapke order #${ord.orderNumber} (₹${ord.total} COD) ka status update:\nFulfillment: ${ord.status}\nVedika Divine Kushinagar Factory`
                      )}`;

                      return (
                        <div
                          key={ord.id || ord.orderNumber}
                          className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-stone-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white text-xs">
                                #{ord.orderNumber}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 truncate">
                                🏪 {ord.shopName}
                              </span>
                            </div>
                            <p className="text-stone-300 truncate">
                              {ord.shopOwnerName} • {ord.shopPhone} • {ord.shippingAddress?.city}
                            </p>
                            <p className="text-[10px] text-stone-500">
                              {formatDate(ord.createdAt)} • {ord.items.length} items
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800 shrink-0">
                            <div className="text-left sm:text-right">
                              <span className="font-serif font-bold text-white text-sm block">
                                {formatCurrency(ord.total)}
                              </span>
                              <span className="text-[10px] text-amber-400 font-semibold block">
                                Comm: +₹{ord.partnerCommissionAmount}
                              </span>
                            </div>

                            <button
                              onClick={() => setInspectOrder(ord)}
                              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>Details</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column (5 cols): Commission Status & Territory Info */}
              <div className="lg:col-span-5 space-y-5">
                {/* Commission Payout Status Card */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">Commission Payout Health</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-2xl bg-stone-950 border border-emerald-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <div>
                          <p className="font-bold text-white">Paid by Admin</p>
                          <p className="text-[10px] text-stone-400">Directly transferred</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-emerald-400 text-base">
                        {formatCurrency(commissionPaidByAdmin)}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-stone-950 border border-amber-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <div>
                          <p className="font-bold text-white">Approved by Admin</p>
                          <p className="text-[10px] text-stone-400">Scheduled for next payout batch</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-amber-400 text-base">
                        {formatCurrency(commissionApprovedByAdmin)}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-500" />
                        <div>
                          <p className="font-bold text-white">Pending Dispatch Verification</p>
                          <p className="text-[10px] text-stone-400">Credited upon parcel delivery</p>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-stone-300 text-base">
                        {formatCurrency(commissionPendingAdmin)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("commission")}
                    className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>View Full Commission Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Territory & Dispatch Center Info */}
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xl text-xs text-stone-300">
                  <h4 className="font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Your Territory & Support Hub</span>
                  </h4>
                  <div className="space-y-1.5">
                    <p>
                      Assigned Area: <strong className="text-amber-400">{territory}</strong>
                    </p>
                    <p>
                      Dispatch Hub: <strong>Kushinagar Central Factory (RMPG Industries)</strong>
                    </p>
                    <p className="text-[11px] text-stone-400 leading-relaxed pt-1">
                      Direct customer and retail deliveries within your region are routed through factory logistics with zero transit charge for dukan orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: RAPID FIELD RETAIL POS (BOOK SHOP ORDER)                          */}
        {/* ========================================================================= */}
        {activeTab === "pos" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-stone-900 via-amber-950/30 to-stone-900 border border-amber-800/60 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-block uppercase tracking-wider">
                  ⚡ High-Speed Field POS
                </span>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Place Order on Behalf of Local Retail Shop
                </h1>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  Dukan ka naam aur dispatch address dalein, products select karein aur COD order lagayein. Company dukan par maal bhejegi aur aapko <strong>{commissionRate}% Commission</strong> credit hoga.
                </p>
              </div>

              {/* Commission Rate Badge */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-amber-500/40 text-center shrink-0 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Distributor Commission
                </span>
                <span className="font-serif text-2xl font-bold text-amber-400">
                  {commissionRate}%
                </span>
                <span className="text-[9px] text-stone-500 block">
                  Per Order Credit
                </span>
              </div>
            </div>

            {/* Reorder Notification Banner */}
            {reorderNotification && (
              <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-600/70 text-amber-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-medium">{reorderNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReorderNotification(null)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer px-2 py-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Success Message Banner */}
            {lastBookedOrder && (
              <div className="p-5 rounded-3xl bg-emerald-950/80 border-2 border-emerald-600 text-emerald-200 text-xs space-y-3 animate-in fade-in zoom-in-95 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        🎉 Order Booked Successfully! (Order #{lastBookedOrder.orderNumber})
                      </h4>
                      <p className="text-emerald-300 text-xs">
                        Dukan: <strong>{lastBookedOrder.shopName}</strong> • Phone: {lastBookedOrder.shopPhone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLastBookedOrder(null)}
                    className="text-stone-400 hover:text-white text-xs cursor-pointer p-1"
                  >
                    ✕ Dismiss
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-black/40 border border-emerald-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Total Dukan Bill (COD)</span>
                    <strong className="text-white text-base font-serif">{formatCurrency(lastBookedOrder.total)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Aapka Commission ({lastBookedOrder.partnerCommissionRate}%)</span>
                    <strong className="text-emerald-400 text-base font-serif">₹{lastBookedOrder.partnerCommissionAmount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Payment Method</span>
                    <strong className="text-stone-200">{lastBookedOrder.paymentMethod}</strong>
                  </div>
                  <a
                    href={`https://wa.me/91${lastBookedOrder.shopPhone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Namaste ${lastBookedOrder.shopOwnerName}, aapki dukan "${lastBookedOrder.shopName}" ke liye Vedika Divine sacred pooja samagri ka order book ho gaya hai!\n\nOrder #${lastBookedOrder.orderNumber}\nTotal Bill: ₹${lastBookedOrder.total} (COD)\nKushinagar manufacturing factory se dispatch hoga. Dhanyawad!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Dukandar ko WhatsApp Slip Bhejein</span>
                  </a>
                </div>
              </div>
            )}

            {bookingError && (
              <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Fast 2-Column POS Form */}
            <form onSubmit={handleBookShopOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (5 Cols): Dukan Details & Bill */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-32">
                {/* Shop Destination Card */}
                <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div className="border-b border-stone-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-400" />
                      <span>1. Dukan / Mandir Details (Delivery Address)</span>
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Jahan factory se maal deliver karna hai
                    </p>
                  </div>

                  {/* Saved Dukan Dropdown & Auto-fill */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-stone-950 border border-amber-600/40">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Saved Dukan Directory (Select for Auto-Fill):</span>
                      </label>
                      {shopName && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSavedShopId("");
                            setShopName("");
                            setShopOwnerName("");
                            setShopPhone("");
                            setShopStreet("");
                            setShopCity("");
                            setShopPincode("");
                            setDistributorNotes("");
                          }}
                          className="text-[10px] text-amber-400 hover:text-white cursor-pointer font-semibold"
                        >
                          + Clear / Nayi Dukan
                        </button>
                      )}
                    </div>

                    <select
                      value={selectedSavedShopId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedSavedShopId(id);
                        if (!id) return;
                        const s = savedShops.find((item) => item.id === id);
                        if (s) {
                          setShopName(s.shopName);
                          setShopOwnerName(s.shopOwnerName);
                          setShopPhone(s.shopPhone);
                          setShopStreet(s.street);
                          setShopCity(s.city);
                          setShopState(s.state || "Uttar Pradesh");
                          setShopPincode(s.pincode);
                          if (s.notes) setDistributorNotes(s.notes);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="">
                        {savedShops.length === 0
                          ? "-- No Saved Shops Yet (Type details below) --"
                          : `-- Select Saved Dukan (${savedShops.length} available) --`}
                      </option>
                      {savedShops.map((s) => (
                        <option key={s.id} value={s.id}>
                          🏪 {s.shopName} - {s.city} ({s.shopOwnerName}) [{s.totalOrdersCount || 0} orders]
                        </option>
                      ))}
                    </select>

                    {/* Quick Chips for Top Saved Shops */}
                    {savedShops.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {savedShops.slice(0, 4).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSelectedSavedShopId(s.id);
                              setShopName(s.shopName);
                              setShopOwnerName(s.shopOwnerName);
                              setShopPhone(s.shopPhone);
                              setShopStreet(s.street);
                              setShopCity(s.city);
                              setShopState(s.state || "Uttar Pradesh");
                              setShopPincode(s.pincode);
                              if (s.notes) setDistributorNotes(s.notes);
                            }}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer truncate max-w-[150px] ${
                              selectedSavedShopId === s.id
                                ? "bg-amber-600 text-white border-amber-500 font-bold"
                                : "bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-300 hover:text-amber-300"
                            }`}
                            title={`Select ${s.shopName}`}
                          >
                            🏪 {s.shopName}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setActiveTab("shops")}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-medium ml-1 cursor-pointer"
                        >
                          View All ({savedShops.length}) →
                        </button>
                      </div>
                    ) : recentShops.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">
                          Recent Orders (1-Tap Auto Fill):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {recentShops.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleApplyRecentShop(s)}
                              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-amber-950/60 border border-stone-800 text-[11px] text-stone-300 hover:text-amber-300 transition-colors cursor-pointer truncate max-w-[140px]"
                            >
                              🏪 {s.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Dukan / Firm Ka Naam *
                      </label>
                      <input
                        type="text"
                        required
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. Maa Durga Pooja Bhandar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                          Dukandar / Malik Ka Naam *
                        </label>
                        <input
                          type="text"
                          required
                          value={shopOwnerName}
                          onChange={(e) => setShopOwnerName(e.target.value)}
                          placeholder="e.g. Rameshwar Gupta"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={shopPhone}
                          onChange={(e) => setShopPhone(e.target.value)}
                          placeholder="e.g. 9874205655"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Delivery Address (Gali / Landmark) *
                      </label>
                      <input
                        type="text"
                        required
                        value={shopStreet}
                        onChange={(e) => setShopStreet(e.target.value)}
                        placeholder="Shop No. 12, Main Mandir Gate, Golghar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                          Shahar *
                        </label>
                        <input
                          type="text"
                          required
                          value={shopCity}
                          onChange={(e) => setShopCity(e.target.value)}
                          placeholder="Kushinagar"
                          className="w-full px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={shopState}
                          onChange={(e) => setShopState(e.target.value)}
                          placeholder="Uttar Pradesh"
                          className="w-full px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={shopPincode}
                          onChange={(e) => setShopPincode(e.target.value)}
                          placeholder="274402"
                          className="w-full px-2.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Special Instructions / Packing Note
                      </label>
                      <input
                        type="text"
                        value={distributorNotes}
                        onChange={(e) => setDistributorNotes(e.target.value)}
                        placeholder="e.g. Dukandar ko call karke parcel handover karein"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                      />
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-center gap-2 text-stone-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-[11px] text-amber-200/80">
                        Auto-Save: Yeh dukan directory me save ho jayegi aur aage 1-Click Repeat Order ke liye ready rahegi.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basket & Live Commission Card */}
                <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                      <span>2. Selected Items ({totalBasketPieces} pcs)</span>
                    </h3>
                    {basketItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setBasket({})}
                        className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {basketItems.length === 0 ? (
                    <div className="py-7 text-center text-stone-500 space-y-1">
                      <Store className="w-7 h-7 mx-auto text-stone-700" />
                      <p className="text-xs text-stone-400 font-semibold">Koi product select nahi kiya gaya</p>
                      <p className="text-[11px] text-stone-600">
                        Right side catalog se boxes add karein.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {basketItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="p-2.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              className="w-9 h-9 rounded-xl object-cover border border-stone-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate text-xs">{item.product.name}</p>
                              <p className="text-[10px] text-stone-400">
                                ₹{item.product.price} / pc
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.product.id!, -1)}
                                className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-amber-400">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(item.product.id!, 1)}
                                className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono font-bold text-white text-xs w-16 text-right">
                              ₹{item.lineTotal}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Payment Selection */}
                  <div className="pt-2 border-t border-stone-800 space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Payment Collection Method
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Cash on Delivery")}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                          paymentMethod === "Cash on Delivery"
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm"
                            : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white"
                        }`}
                      >
                        📦 Cash on Delivery (COD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("UPI / Online Payment")}
                        className={`p-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                          paymentMethod === "UPI / Online Payment"
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm"
                            : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white"
                        }`}
                      >
                        💳 Paid via Online / UPI
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown & Live Commission Card */}
                  <div className="pt-3 border-t border-stone-800 space-y-2">
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Dukan Bill Amount</span>
                      <strong className="text-white font-mono">{formatCurrency(basketSubtotal)}</strong>
                    </div>
                    <div className="flex justify-between text-xs text-stone-400">
                      <span>Transport Dispatch</span>
                      <span className="text-emerald-400 font-bold">FREE FACTORY DELIVERY</span>
                    </div>

                    {/* LIVE COMMISSION DISPLAY */}
                    <div className="p-3.5 rounded-2xl bg-linear-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border-2 border-amber-500/60 flex items-center justify-between gap-3 text-xs shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">
                            Aapka Distributor Commission ({commissionRate}%)
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Order deliver hote hi payout ke liye add hoga
                          </p>
                        </div>
                      </div>
                      <span className="font-serif text-xl font-extrabold text-amber-400">
                        ₹{potentialCommission}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={bookingOrder || basketItems.length === 0}
                    className="w-full py-4 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                  >
                    {bookingOrder ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>Booking Shop Order...</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-4 h-4" />
                        <span>Confirm & Book Dukan Order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column (7 Cols): High-Speed Product Picker */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>Products Catalog (Select for Dukan)</span>
                      </h3>
                      <p className="text-xs text-stone-400">
                        Carton presets par click karke turant boxes add karein
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product name..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Product Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((p) => {
                        const inBasket = basket[p.id!] || 0;

                        return (
                          <div
                            key={p.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                              inBasket > 0
                                ? "bg-amber-950/25 border-amber-600/70 shadow-md shadow-amber-950/40"
                                : "bg-stone-950 border-stone-800 hover:border-stone-700"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="relative rounded-xl overflow-hidden aspect-16/10 bg-stone-900">
                                <img
                                  src={p.thumbnail}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                                {inBasket > 0 && (
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500 text-stone-950 shadow-md">
                                    {inBasket} in Order
                                  </span>
                                )}
                              </div>

                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">
                                  {p.category}
                                </span>
                                <h4 className="font-serif font-bold text-white text-xs line-clamp-1">
                                  {p.name}
                                </h4>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-stone-800/80 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-serif font-bold text-amber-400 text-sm">
                                  {formatCurrency(p.price)}
                                </span>
                                <span className="text-[10px] text-stone-500">
                                  Carton: {formatCurrency(p.price * 24)}
                                </span>
                              </div>

                              {/* Steppers & Quick Carton Buttons */}
                              <div className="grid grid-cols-12 gap-1.5 items-center">
                                <div className="col-span-5 flex items-center justify-between bg-stone-900 border border-stone-800 rounded-xl p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(p.id!, -1)}
                                    className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="font-mono font-bold text-xs text-white">
                                    {inBasket}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(p.id!, 1)}
                                    className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddCarton(p.id!, 12)}
                                  className="col-span-3 py-1 px-1 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-bold text-[9px] uppercase transition-colors text-center cursor-pointer"
                                  title="Add 12 pieces"
                                >
                                  +12 pcs
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAddCarton(p.id!, 24)}
                                  className="col-span-4 py-1 px-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-[9px] uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                  title="Add 1 Master Carton (24 pieces)"
                                >
                                  <Package className="w-2.5 h-2.5 text-amber-400" />
                                  <span>+1 Carton</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW: MY RETAIL SHOPS NETWORK & 1-CLICK REORDERS                          */}
        {/* ========================================================================= */}
        {activeTab === "shops" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-600/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2 relative z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase tracking-widest inline-block">
                  Verified Retail Directory
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
                  <Store className="w-6 h-6 text-amber-400" />
                  <span>My Retail Shops Network (मेरी दुकानें)</span>
                </h1>
                <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
                  Aapke dwara jude sabhi retail dukandar aur mandir pooja counters ka live record. Yahan se kisi bhi dukan ka pichla order <strong>1-Click me Repeat</strong> karein ya fresh items select karke naya order place karein.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
                <button
                  onClick={() => {
                    setSelectedSavedShopId("");
                    setShopName("");
                    setShopOwnerName("");
                    setShopPhone("");
                    setShopStreet("");
                    setShopCity("");
                    setShopPincode("");
                    setDistributorNotes("");
                    setBasket({});
                    setActiveTab("pos");
                  }}
                  className="px-5 py-3 rounded-2xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add / Book New Dukan</span>
                </button>
              </div>
            </div>

            {/* Network KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Saved Retail Shops
                  </span>
                  <Store className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-serif font-bold text-white">
                  {savedShops.length}
                </p>
                <p className="text-[11px] text-stone-500">
                  Total client shops in your territory
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Total Network Orders
                  </span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-serif font-bold text-amber-400">
                  {savedShops.reduce((sum, s) => sum + (s.totalOrdersCount || 0), 0)}
                </p>
                <p className="text-[11px] text-stone-500">
                  Lifetime assisted dukan orders
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Total Retail Business
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-serif font-bold text-emerald-400">
                  {formatCurrency(savedShops.reduce((sum, s) => sum + (s.totalSpent || 0), 0))}
                </p>
                <p className="text-[11px] text-stone-500">
                  Combined gross retail billing (COD)
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Active Coverage
                  </span>
                  <MapPin className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-serif font-bold text-stone-200">
                  {new Set(savedShops.map((s) => s.city?.trim()).filter(Boolean)).size || 1} Cities
                </p>
                <p className="text-[11px] text-stone-500">
                  Across {territory}
                </p>
              </div>
            </div>

            {/* Search & Actions Bar */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={shopSearchQuery}
                    onChange={(e) => setShopSearchQuery(e.target.value)}
                    placeholder="Dukan ka naam, dukandar, shahar ya phone khojein..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                  />
                  {shopSearchQuery && (
                    <button
                      onClick={() => setShopSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span>
                    Showing <strong className="text-white">{filteredSavedShops.length}</strong> of {savedShops.length} shops
                  </span>
                </div>
              </div>

              {/* Saved Shops Cards Grid */}
              {loadingShops ? (
                <div className="py-16 text-center text-stone-400 space-y-3">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs uppercase font-bold tracking-wider">Loading Retail Shop Network...</p>
                </div>
              ) : filteredSavedShops.length === 0 ? (
                <div className="py-16 text-center text-stone-500 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-stone-950 border border-stone-800 text-stone-600 flex items-center justify-center mx-auto">
                    <Store className="w-7 h-7" />
                  </div>
                  {savedShops.length === 0 ? (
                    <div className="space-y-2 max-w-md mx-auto">
                      <h4 className="font-bold text-white text-sm">Koi Dukan Directory Me Saved Nahi Hai</h4>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Jab aap &ldquo;Quick Shop Order (POS)&rdquo; tab se kisi bhi dukan ka pehla order book karenge, dukan ka address yahan auto-save ho jayegi aur aap har baar 1-Click me Repeat Order kar sakenge.
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab("pos")}
                          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Book Pehla Dukan Order
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Koi Match Nahi Mila</h4>
                      <p className="text-xs text-stone-400">
                        &ldquo;{shopSearchQuery}&rdquo; ke naam se koi dukan uplabdh nahi hai.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSavedShops.map((shop) => {
                    const cleanPhone = (shop.shopPhone || "").replace(/[^0-9]/g, "");
                    const whatsappLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                      `Namaste ${shop.shopOwnerName}, Vedika Divine pooja samagri factory order ke sambandh me sampark kar raha hu. Aapki dukan "${shop.shopName}" ke liye koi naya stock bhejna hai?`
                    )}`;
                    const hasLastOrder = shop.lastOrderItems && shop.lastOrderItems.length > 0;

                    return (
                      <div
                        key={shop.id}
                        className="p-5 rounded-3xl bg-stone-950 border border-stone-800 hover:border-amber-600/50 transition-all flex flex-col justify-between space-y-4 shadow-md group"
                      >
                        <div className="space-y-3">
                          {/* Card Top: Name & Location Pill */}
                          <div className="flex items-start justify-between gap-2 border-b border-stone-900 pb-3">
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                                Retail Partner
                              </span>
                              <h3 className="font-serif font-bold text-white text-base truncate group-hover:text-amber-300 transition-colors">
                                {shop.shopName}
                              </h3>
                              <p className="text-xs text-stone-300 font-medium mt-0.5">
                                Dukandar: <strong>{shop.shopOwnerName}</strong>
                              </p>
                            </div>

                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800 shrink-0">
                              {shop.city}
                            </span>
                          </div>

                          {/* Contact & Address */}
                          <div className="space-y-1.5 text-xs text-stone-400">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <a
                                href={`tel:${shop.shopPhone}`}
                                className="text-stone-300 hover:text-white font-mono"
                              >
                                {shop.shopPhone}
                              </a>
                            </div>

                            <div className="flex items-start gap-2 pt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                              <p className="text-stone-300 text-[11px] leading-relaxed line-clamp-2">
                                {shop.street}, {shop.city}, {shop.state || "UP"} - {shop.pincode}
                              </p>
                            </div>
                          </div>

                          {/* Business Stats Grid */}
                          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs">
                            <div>
                              <span className="text-[10px] uppercase text-stone-400 font-bold block">Orders Placed</span>
                              <strong className="text-white text-sm font-serif">
                                {shop.totalOrdersCount || 0} Orders
                              </strong>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase text-stone-400 font-bold block">Total Spent</span>
                              <strong className="text-emerald-400 text-sm font-serif">
                                {formatCurrency(shop.totalSpent || 0)}
                              </strong>
                            </div>
                            {shop.lastOrderDate && (
                              <div className="col-span-2 pt-1 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                                <span>Last Order:</span>
                                <span className="text-stone-300 font-mono">
                                  {formatDate(shop.lastOrderDate)} {shop.lastOrderNumber ? `(#${shop.lastOrderNumber})` : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Last Order Items Preview */}
                          {hasLastOrder && (
                            <div className="space-y-1 text-xs">
                              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                                Pichle Order ke Items ({shop.lastOrderItems!.length}):
                              </span>
                              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto pr-1">
                                {shop.lastOrderItems!.map((it, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-lg bg-stone-900 border border-stone-800 text-[10px] text-stone-300 truncate max-w-[150px]"
                                    title={`${it.quantity}x ${it.name}`}
                                  >
                                    {it.quantity}x {it.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Action Buttons */}
                        <div className="space-y-2 pt-2 border-t border-stone-900">
                          {/* Repeat Last Order Button */}
                          <button
                            type="button"
                            onClick={() => handleRepeatLastOrder(shop)}
                            className="w-full py-2.5 rounded-xl bg-linear-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all active:scale-98"
                            title="Load previous items directly into POS basket"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Repeat Last Order (पिछला दोहराएं)</span>
                          </button>

                          <div className="grid grid-cols-6 gap-2">
                            {/* New Order / Choose Items */}
                            <button
                              type="button"
                              onClick={() => handleNewOrderForShop(shop)}
                              className="col-span-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                              title="Start order with empty basket"
                            >
                              <Plus className="w-3.5 h-3.5 text-amber-400" />
                              <span>New Order (नया आर्डर)</span>
                            </button>

                            {/* WhatsApp Button */}
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="col-span-1 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 flex items-center justify-center transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            {/* Delete Shop Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSavedShop(shop.id, shop.shopName)}
                              disabled={deletingShopId === shop.id}
                              className="col-span-1 py-2 rounded-xl bg-stone-900 hover:bg-rose-950 border border-stone-800 hover:border-rose-800 text-stone-500 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete shop from directory"
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
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: MY SHOP ORDERS & CONSIGNMENT TRACKING                             */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-400" />
                    <span>My Field Bookings & Consignments</span>
                  </h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Track delivery fulfillment, dukan dispatch receipts, and commission payout status
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("pos")}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Shop Order</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Dukan name, owner, phone, order #..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="All">All Delivery Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <select
                    value={orderCommissionFilter}
                    onChange={(e) => setOrderCommissionFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:border-amber-500 focus:outline-hidden"
                  >
                    <option value="All">All Commission Payouts</option>
                    <option value="Pending">Pending Payout</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid by Admin 🟢</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              {loadingOrders ? (
                <div className="py-16 text-center text-stone-400 space-y-2">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-stone-500 space-y-3">
                  <Store className="w-10 h-10 mx-auto text-stone-700" />
                  <p className="font-semibold text-stone-300 text-sm">Koi order record nahi mila</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Filters check karein ya naya dukan order book karein.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-stone-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Order # & Date</th>
                        <th className="py-3.5 px-4">Dukan & Contact</th>
                        <th className="py-3.5 px-4">Delivery Status</th>
                        <th className="py-3.5 px-4">Dukan Bill</th>
                        <th className="py-3.5 px-4">Distributor Commission</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 text-stone-300">
                      {filteredOrders.map((ord) => {
                        const cleanPhone = (ord.shopPhone || "").replace(/[^0-9]/g, "");
                        const whatsappMsg = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                          `Namaste ${ord.shopOwnerName}, aapke order #${ord.orderNumber} (₹${ord.total} COD) ka status update:\nStatus: ${ord.status}\nVedika Divine Kushinagar Factory`
                        )}`;

                        return (
                          <tr key={ord.id} className="hover:bg-stone-800/40 transition-colors">
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-mono font-bold text-white text-xs">
                                #{ord.orderNumber}
                              </p>
                              <p className="text-[10px] text-stone-500">
                                {formatDate(ord.createdAt)}
                              </p>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-bold text-white text-xs truncate max-w-[180px]">
                                {ord.shopName || "Retail Shop"}
                              </p>
                              <p className="text-[11px] text-stone-400">
                                {ord.shopOwnerName} • {ord.shopPhone}
                              </p>
                              <p className="text-[10px] text-stone-500">
                                {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                              </p>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  ord.status === "Delivered"
                                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                    : ord.status === "Shipped"
                                    ? "bg-blue-950 text-blue-300 border-blue-800"
                                    : ord.status === "Processing"
                                    ? "bg-amber-950 text-amber-300 border-amber-800"
                                    : "bg-stone-800 text-stone-300 border-stone-700"
                                }`}
                              >
                                {ord.status}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-serif font-bold text-white text-sm">
                                {formatCurrency(ord.total)}
                              </p>
                              <span className="text-[10px] text-stone-500 block">
                                {ord.paymentMethod === "Cash on Delivery" ? "COD" : "Prepaid"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <p className="font-serif font-bold text-amber-300 text-sm">
                                +₹{ord.partnerCommissionAmount || 0}
                              </p>
                              <span
                                className={`inline-block text-[9px] font-bold px-2 py-0.2 rounded-md uppercase border mt-0.5 ${
                                  ord.commissionStatus === "Paid"
                                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                    : ord.commissionStatus === "Approved"
                                    ? "bg-amber-950 text-amber-300 border-amber-800"
                                    : "bg-stone-900 text-stone-400 border-stone-700"
                                }`}
                              >
                                {ord.commissionStatus === "Paid"
                                  ? "Paid by Admin 🟢"
                                  : ord.commissionStatus === "Approved"
                                  ? "Approved 🟡"
                                  : "Pending ⏳"}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setInspectOrder(ord)}
                                  className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                  title="View Full Order Slip"
                                >
                                  <Eye className="w-3 h-3 text-amber-400" />
                                  <span>Slip</span>
                                </button>
                                <a
                                  href={whatsappMsg}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 transition-colors"
                                  title="Send WhatsApp update to Shopkeeper"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: COMMISSION LEDGER & PAYOUT STATEMENT                              */}
        {/* ========================================================================= */}
        {activeTab === "commission" && (
          <div className="space-y-6">
            {/* Executive Commission Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-linear-to-br from-stone-900 to-amber-950/40 border border-amber-600/40 space-y-1.5 shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                  Total Commission Earned
                </span>
                <p className="text-3xl font-serif font-bold text-amber-400">
                  {formatCurrency(totalCommissionEarned)}
                </p>
                <p className="text-[11px] text-stone-400">
                  Calculated at {commissionRate}% of retail turnover
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-emerald-900/50 space-y-1.5 shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                  Paid by Admin (Received)
                </span>
                <p className="text-3xl font-serif font-bold text-emerald-400">
                  {formatCurrency(commissionPaidByAdmin)}
                </p>
                <p className="text-[11px] text-stone-400">
                  Settled to your Bank / UPI account
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-amber-900/50 space-y-1.5 shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                  Approved (Due for Payout)
                </span>
                <p className="text-3xl font-serif font-bold text-amber-400">
                  {formatCurrency(commissionApprovedByAdmin)}
                </p>
                <p className="text-[11px] text-stone-400">
                  Verified by admin, scheduled for transfer
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-1.5 shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                  Pending Transit Verification
                </span>
                <p className="text-3xl font-serif font-bold text-stone-300">
                  {formatCurrency(commissionPendingAdmin)}
                </p>
                <p className="text-[11px] text-stone-500">
                  Orders out for delivery to shops
                </p>
              </div>
            </div>

            {/* Payout Information Notice */}
            <div className="p-4.5 rounded-3xl bg-stone-900 border border-stone-800 text-xs text-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span>Commission Settlement Cycle</span>
                </h4>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Admin team har hafte dukan COD collection confirm hone ke baad aapke account me direct bank transfer ya UPI se commission bhejti hai.
                </p>
              </div>

              <a
                href={whatsappProductionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-stone-700"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Accounts Desk</span>
              </a>
            </div>

            {/* Commission Ledger Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="border-b border-stone-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span>Itemized Order Commission Ledger</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Ek ek order ka commision rate, amount aur admin settlement status
                </p>
              </div>

              {assistedOrders.length === 0 ? (
                <div className="py-12 text-center text-stone-500">
                  Koi commission record uplabdh nahi hai.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-stone-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Date & Order #</th>
                        <th className="py-3 px-4">Dukan Name</th>
                        <th className="py-3 px-4">Order Value</th>
                        <th className="py-3 px-4">Comm. Rate</th>
                        <th className="py-3 px-4">Aapka Comm.</th>
                        <th className="py-3 px-4">Admin Payout Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 text-stone-300">
                      {assistedOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-800/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-white text-xs block">
                              #{ord.orderNumber}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {formatDate(ord.createdAt)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <strong className="text-white text-xs block">{ord.shopName}</strong>
                            <span className="text-[11px] text-stone-400">
                              {ord.shippingAddress?.city}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-white">
                            {formatCurrency(ord.total)}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-400">
                            {ord.partnerCommissionRate || commissionRate}%
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-serif font-bold text-amber-400 text-sm">
                            +₹{ord.partnerCommissionAmount || 0}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                ord.commissionStatus === "Paid"
                                  ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                  : ord.commissionStatus === "Approved"
                                  ? "bg-amber-950 text-amber-300 border-amber-800"
                                  : "bg-stone-900 text-stone-400 border-stone-700"
                              }`}
                            >
                              {ord.commissionStatus === "Paid" ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Paid by Admin</span>
                                </>
                              ) : ord.commissionStatus === "Approved" ? (
                                <>
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  <span>Approved for Payout</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-stone-500" />
                                  <span>Pending Delivery Verification</span>
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: FACTORY WHOLESALE MASTER CARTONS B2B                              */}
        {/* ========================================================================= */}
        {activeTab === "wholesale" && (
          <div className="space-y-6">
            <div className="bg-linear-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-800/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="space-y-3 relative z-10 max-w-3xl">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 inline-block">
                  Factory Direct B2B Pricing
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Factory Wholesale Master Carton Pricing
                </h2>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Direct Kushinagar manufacturing unit se master carton bulk dispatch order karein. Exclusive distributor margin, bubble-wrapped packaging, aur priority factory dispatch.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 text-stone-200">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>All-India Transport Dispatch</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-200">
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>Minimum Order: 1 Master Carton (24 pcs)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>GST B2B Tax Invoicing Available</span>
                  </span>
                </div>
              </div>
            </div>

            {orderSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <p className="font-semibold leading-relaxed">{orderSuccess}</p>
              </div>
            )}

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => {
                const wholesaleRate = p.wholesalePrice || Math.round(p.price * 0.55);
                const margin = Math.round(((p.price - wholesaleRate) / p.price) * 100);

                return (
                  <div
                    key={p.id}
                    className="bg-stone-900 border border-stone-800 hover:border-amber-600/50 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md group"
                  >
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-950 border border-stone-800">
                        <img
                          src={p.thumbnail}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-md">
                          {margin}% Partner Margin
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {p.category}
                        </span>
                        <h4 className="font-serif font-bold text-white text-base">
                          {p.name}
                        </h4>
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                          {p.description}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 space-y-1 text-xs">
                        <div className="flex justify-between text-stone-400">
                          <span>Retail MRP:</span>
                          <span className="line-through">{formatCurrency(p.price)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-amber-400">
                          <span>Wholesale Price:</span>
                          <span className="text-sm font-serif">{formatCurrency(wholesaleRate)} / pc</span>
                        </div>
                        <div className="flex justify-between text-stone-500 text-[10px] pt-1 border-t border-stone-800">
                          <span>Master Carton (24 pcs):</span>
                          <span className="font-mono text-stone-300">{formatCurrency(wholesaleRate * 24)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenWholesaleModal(p)}
                      className="w-full py-3 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Package className="w-4 h-4" />
                      <span>Order Master Cartons</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. ORDER DETAILS MODAL (VIEW FULL SLIP)                                    */}
      {/* ========================================================================= */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Dukan Dispatch Consignment
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                  Order #{inspectOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dukan Details */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Dukan / Firm:</span>
                <strong className="text-white text-sm">{inspectOrder.shopName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Dukandar:</span>
                <span className="text-stone-200">{inspectOrder.shopOwnerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Phone:</span>
                <span className="text-stone-200 font-mono">{inspectOrder.shopPhone}</span>
              </div>
              <div className="flex justify-between items-start pt-1 border-t border-stone-900">
                <span className="text-stone-400">Delivery Address:</span>
                <span className="text-stone-300 text-right max-w-[240px]">
                  {inspectOrder.shippingAddress?.street}, {inspectOrder.shippingAddress?.city},{" "}
                  {inspectOrder.shippingAddress?.pincode}
                </span>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Ordered Items ({inspectOrder.items.reduce((s, i) => s + i.quantity, 0)} pcs)
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {inspectOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-[11px]">
                        {it.quantity}x
                      </span>
                      <span className="text-stone-200 font-medium">{it.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      ₹{it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission & Settlement Status Card */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/50 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-300">Total Dukan Bill (COD):</span>
                <strong className="text-white font-serif text-base">{formatCurrency(inspectOrder.total)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold">Aapka Commission ({inspectOrder.partnerCommissionRate}%):</span>
                <strong className="text-amber-400 font-serif text-lg">₹{inspectOrder.partnerCommissionAmount}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-amber-800/50">
                <span className="text-stone-400">Admin Payout Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    inspectOrder.commissionStatus === "Paid"
                      ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                      : inspectOrder.commissionStatus === "Approved"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-stone-900 text-stone-400 border-stone-700"
                  }`}
                >
                  {inspectOrder.commissionStatus === "Paid"
                    ? "Paid by Admin 🟢"
                    : inspectOrder.commissionStatus === "Approved"
                    ? "Approved for Payout 🟡"
                    : "Pending Delivery ⏳"}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/91${(inspectOrder.shopPhone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Namaste ${inspectOrder.shopOwnerName}, aapki dukan "${inspectOrder.shopName}" ke order #${inspectOrder.orderNumber} ki receipt:\nTotal Bill: ₹${inspectOrder.total} (COD)\nDelivery: ${inspectOrder.status}\nVedika Divine Kushinagar Factory`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Slip to Dukandar</span>
              </a>
              <button
                onClick={() => setInspectOrder(null)}
                className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. WHOLESALE CARTON ORDER POPUP MODAL (WITH SHOP DESTINATION DETAILS)     */}
      {/* ========================================================================= */}
      {selectedCarton && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCarton.thumbnail}
                  alt={selectedCarton.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-700"
                />
                <div>
                  <h3 className="font-bold text-white text-base">{selectedCarton.name}</h3>
                  <span className="text-xs text-amber-400 font-mono">
                    Wholesale: {formatCurrency(selectedCarton.wholesalePrice || Math.round(selectedCarton.price * 0.55))} / pc
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCarton(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {wsError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{wsError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs text-stone-300">
              {/* Carton Packaging & Pricing Card */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">Master Carton Pack:</span>
                  <span className="font-bold text-white">24 Pieces per Carton</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Pieces in this Order:</span>
                  <span className="font-bold text-amber-400">{cartonQty * 24} Items</span>
                </div>
                <div className="flex justify-between border-t border-stone-900 pt-1 text-sm font-bold text-white">
                  <span>Estimated Total Amount:</span>
                  <span className="font-serif text-amber-400">
                    {formatCurrency(
                      (selectedCarton.wholesalePrice || Math.round(selectedCarton.price * 0.55)) *
                        24 *
                        cartonQty
                    )}
                  </span>
                </div>
              </div>

              {/* Quantity Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Select Master Cartons Quantity:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setCartonQty(qty)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        cartonQty === qty
                          ? "bg-amber-600 border-amber-500 text-white shadow-xs"
                          : "bg-stone-950 border-stone-800 text-stone-400 hover:text-white"
                      }`}
                    >
                      {qty} Cartons
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Dispatch Shop Details */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-amber-600/40 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dispatch Destination / Dukan Address (सामान कहाँ भेजना है) *</span>
                  </label>
                </div>

                {/* Saved Shop Dropdown */}
                {savedShops.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Choose from Saved Dukan Directory:
                    </label>
                    <select
                      value={wsSelectedShopId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setWsSelectedShopId(id);
                        if (!id) return;
                        const s = savedShops.find((item) => item.id === id);
                        if (s) {
                          setWsShopName(s.shopName);
                          setWsContactPerson(s.shopOwnerName);
                          setWsPhone(s.shopPhone);
                          setWsStreet(s.street);
                          setWsCity(s.city);
                          setWsPincode(s.pincode);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:border-amber-400 focus:outline-hidden"
                    >
                      <option value="">-- Select Saved Dukan / Custom Address --</option>
                      {savedShops.map((s) => (
                        <option key={s.id} value={s.id}>
                          🏪 {s.shopName} - {s.city} ({s.shopOwnerName})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Dukan / Godown / Firm Ka Naam *
                    </label>
                    <input
                      type="text"
                      required
                      value={wsShopName}
                      onChange={(e) => setWsShopName(e.target.value)}
                      placeholder="e.g. Kushinagar Mandir Pooja Bhandar"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Dukandar / Contact Person *
                      </label>
                      <input
                        type="text"
                        required
                        value={wsContactPerson}
                        onChange={(e) => setWsContactPerson(e.target.value)}
                        placeholder="e.g. Rameshwar Gupta"
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={wsPhone}
                        onChange={(e) => setWsPhone(e.target.value)}
                        placeholder="e.g. 9874205655"
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Delivery Address (Gali, Chowk, Landmark) *
                    </label>
                    <input
                      type="text"
                      required
                      value={wsStreet}
                      onChange={(e) => setWsStreet(e.target.value)}
                      placeholder="Shop No. 5, Main Mandir Road"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Shahar *
                      </label>
                      <input
                        type="text"
                        required
                        value={wsCity}
                        onChange={(e) => setWsCity(e.target.value)}
                        placeholder="Kushinagar"
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={wsPincode}
                        onChange={(e) => setWsPincode(e.target.value)}
                        placeholder="274402"
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Dispatch Transport Note
                    </label>
                    <input
                      type="text"
                      value={wsNotes}
                      onChange={(e) => setWsNotes(e.target.value)}
                      placeholder="e.g. Dukan par sham 5 baje se pehle deliver karein"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:border-amber-500 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => handlePlaceWholesaleOrder(selectedCarton)}
                disabled={submittingOrder}
                className="flex-1 py-3 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submittingOrder ? "Submitting Dispatch Request..." : "Confirm Factory Dispatch Request"}
              </button>
              <button
                onClick={() => setSelectedCarton(null)}
                className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
