import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { StoreLayoutShell } from "@/components/layout/StoreLayoutShell";

export const metadata: Metadata = {
  title: "Vedika Divine Candles | Handcrafted Luxury Soy Wax & Scented Candles | Authorized Dealer",
  description:
    "Explore pure handcrafted soy wax scented candles, luxury frosted amber glass jars, temple wax diyas, bubble pillars, and wholesale dealer bulk cartons across India.",
  keywords: [
    "vedika divine candles",
    "candle dealer india",
    "scented soy candles wholesale",
    "mombatti wholesale manufacturer",
    "luxury jar candles",
    "bubble pillar candles",
    "bulk candles for wedding gifting",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vedika Divine",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full max-w-full overflow-x-hidden m-0 p-0">
      <body className="antialiased min-h-screen flex flex-col bg-[#fffdf9] text-stone-900 w-full max-w-full overflow-x-hidden m-0 p-0">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <StoreLayoutShell>{children}</StoreLayoutShell>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
