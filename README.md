# Vedika Devine 🕯️✨
> **Light Up Good Vibes** — Handcrafted Artisanal Soy Wax & Scented Candles  
> **Firm Legal Name:** M/S RMPG VEDIKA DIVINE HOME INDUSTRIES (Registered Partnership Firm)  
> **Manufacturing Atelier:** Kushinagar, Uttar Pradesh, India • **Helpline:** +91 8874205655 / +91 9129598282  

---

## 🏛️ Project Overview
**Vedika Devine** is a luxury direct-to-consumer (D2C) and wholesale B2B e-commerce platform dedicated to hand-poured, 100% paraffin-free soy wax candles, therapeutic aroma jars, temple akhand diyas, and festive corporate gifting sets.

### 🌟 Key Highlights
- **100% Paraffin-Free & Eco-Luxury:** Organic soy wax handcrafting with natural lead-free cotton wicks.
- **ImageKit CDN Integration:** Fast global image delivery without direct heavy binary storage in Firestore.
- **Real-Time Consignment & Courier Tracking:** 5-step milestone tracking (Placed, Handcrafted, Dispatched, Out for Delivery, Delivered) with AWB tracking numbers and direct courier portal links (Blue Dart, Delhivery, DTDC, India Post).
- **Public & Member Order Tracking:** Track via Order Number (`VD-XXXXXX-XXXX`) and phone number or directly in member dashboard.
- **Complete User Account Portal:** Multi-address management (Add, Edit, Delete, Default), profile updating, and password credentials security.
- **Wholesale Dealer Portal:** Master carton order tiering, GST billing, and wholesale dealer registration.
- **Admin Management Console:** Real-time catalog management, category sequence ordering, stock & inventory control, and dispatch fulfillment.

---

## 📁 Monorepo Structure
```text
vedika-devine/
├── backend/                  # 🛡️ Shared Backend Services & Firebase Integration
│   ├── src/
│   │   ├── config/           # Firebase initialization & constants
│   │   ├── types/            # TypeScript models (Product, Order, User, Category, Inquiry)
│   │   ├── services/         # Services (Auth, Product, Order, Category, Cart, Wishlist)
│   │   ├── utils/            # Formatters (INR currency, dates, SLA calculations)
│   │   └── index.ts          # Shared exports
│   └── package.json
│
├── web/                      # 🌐 Next.js 16 (App Router + Tailwind CSS 4)
│   ├── src/
│   │   ├── app/              # Routes (Home, Shop, Profile, Orders, Track Order, Admin, Dealer)
│   │   ├── components/       # UI (Header, Footer, Modals, CategoryPills, Tracking)
│   │   └── context/          # AuthContext, CartContext, WishlistContext
│   └── package.json
│
└── mobile/                   # 📱 Mobile Application (React Native / Expo Architecture)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
# OR:
cd web && npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build
```bash
cd web && npm run build
```

---

## 🔒 Environment Configuration
Configure your `.env.local` inside `web/`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vedika-e-com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
```

---

## 📜 License & Ownership
Copyright © 2026 M/S RMPG VEDIKA DIVINE HOME INDUSTRIES. All rights reserved.
