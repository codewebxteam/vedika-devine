export const COLLECTIONS = {
  PRODUCTS: "products",
  USERS: "users",
  ORDERS: "orders",
  CATEGORIES: "categories",
  REVIEWS: "reviews",
  WISHLISTS: "wishlists",
  CARTS: "carts",
  INQUIRIES: "inquiries",
  DEALER_SHOPS: "dealer_shops",
} as const;

export const CATEGORIES = [
  {
    id: "scented-candles",
    name: "Scented & Aromatherapy",
    slug: "scented-candles",
    description: "Premium pure essential oil infused soy wax candles for relaxation",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "luxury-jars",
    name: "Luxury Glass Jars & Tins",
    slug: "luxury-jars",
    description: "Frosted amber glass and golden metal tins with wooden crackling wicks",
    icon: "Flame",
    image: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pooja-temple-candles",
    name: "Pooja & Akhand Wax Diyas",
    slug: "pooja-temple-candles",
    description: "Pure cow ghee & natural wax consecrated candles for mandir & aarti",
    icon: "Sun",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "decorative-pillars",
    name: "Pillar & Bubble Sculptures",
    slug: "decorative-pillars",
    description: "Aesthetic ribbed, bubble, twist, and geometric home decor candles",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1608181831890-5026eb95bc72?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tealights-floating",
    name: "Tealights & Floating Candles",
    slug: "tealights-floating",
    description: "Smokeless aluminum & clear cup tealights for urli bowls and diffusers",
    icon: "CircleDot",
    image: "https://images.unsplash.com/photo-1508781197106-d8c5ae57d2d7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wholesale-bulk-packs",
    name: "Wholesale & Dealer Cartons",
    slug: "wholesale-bulk-packs",
    description: "Bulk master cartons at dealer price for retailers, weddings, and gifting",
    icon: "Shield",
    image: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?auto=format&fit=crop&w=600&q=80",
  },
] as const;

export const ORDER_STATUS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
} as const;

export const PAYMENT_METHODS = {
  COD: "Cash on Delivery",
  UPI: "UPI / Online Payment",
  CARD: "Credit / Debit Card",
  NET_BANKING: "Net Banking",
} as const;

export const APP_CONFIG = {
  COMPANY_LEGAL_NAME: "M/S RMPG VEDIKA DIVINE HOME INDUSTRIES",
  ENTITY_TYPE: "Partnership Firm",
  BRAND_NAME: "Vedika Divine",
  TAGLINE: "Handcrafted Luxury, Aromatherapy & Sacred Candles",
  CURRENCY: "₹",
  FREE_SHIPPING_THRESHOLD: 499,
  SHIPPING_FEE: 49,
  SUPPORT_EMAIL: "vedikadivine@gmail.com",
  SUPPORT_PHONE: "+91 8874205655",
  PHONE_RAW: "8874205655",
  WHOLESALE_PHONE: "+91 8874205655",
  WEBSITE: "www.vedikadivine.com",
  REGISTERED_ADDRESS: "TURKPATTI BAZAR, POST: MAHUAWA BUZURG, DISTRICT: KUSHINAGAR, UTTAR PRADESH – 274302, INDIA",
  MANUFACTURING_UNIT: "Turkpatti Bazar, Post: Mahuawa Buzurg, Kushinagar, Uttar Pradesh – 274302, India",
  SOCIAL_LINKS: {
    INSTAGRAM: "https://www.instagram.com/vedikadivine_official?fqnt=MXJtcWdnY2lrNHgx",
    FACEBOOK: "https://www.facebook.com/share/184fJnvzTz/",
    YOUTUBE: "https://youtube.com/@vedikadivine_official?si=Oi8kkRScgLTEQnWS",
  },
};
