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
    id: "pooja-hawan-samagri",
    name: "Pooja & Hawan Samagri (पूजा एवं हवन सामग्री)",
    slug: "pooja-hawan-samagri",
    description: "Shuddh Bhimseni Kapur, Vedic Hawan Samagri, Chandan, Roli, Guggal, Loban & sacred rituals",
    icon: "Sun",
    image: "https://images.unsplash.com/photo-1609137144820-2210874051a8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dhoop-agarbatti",
    name: "Dhoop & Agarbatti (धूपबत्ती एवं अगरbatti)",
    slug: "dhoop-agarbatti",
    description: "Charcoal-free dry dhoop cones, bamboo-less herbal sticks, sambrani cups & pure attar",
    icon: "Flame",
    image: "https://images.unsplash.com/photo-1608181831890-5026eb95bc72?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "pure-ghee-diyas",
    name: "Pure Cow Ghee & Akhand Diyas (शुद्ध गाय का घी एवं दीये)",
    slug: "pure-ghee-diyas",
    description: "100% pure consecrated cow ghee wicks, brass temple aarti diyas & akhand jyot",
    icon: "Sun",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "complete-pooja-kits",
    name: "Pooja Kits & Festive Sets (सम्पूर्ण पूजा किट एवं थाली)",
    slug: "complete-pooja-kits",
    description: "Complete Vedic ritual boxes for Daily Puja, Navratri, Diwali, Griha Pravesh & Havan",
    icon: "Shield",
    image: "https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "scented-candles",
    name: "Aromatic & Sacred Candles (सुगंधित एवं लक्ज़री कैंडल्स)",
    slug: "scented-candles",
    description: "Pure soy wax temple aroma candles, sandalwood jars & natural botanical fragrances",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "wholesale-bulk-packs",
    name: "Wholesale & Dealer Cartons (थोक एवं डीलर कार्टन)",
    slug: "wholesale-bulk-packs",
    description: "Direct factory master cartons at distributor pricing for retail dukans and temple vendors",
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
  TAGLINE: "Pure Sacred Pooja Samagri, Hawan & Divine Fragrances",
  TAGLINE_HINDI: "शुद्ध पूजा सामग्री, धूप, दीप एवं दिव्य सुगंध",
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
