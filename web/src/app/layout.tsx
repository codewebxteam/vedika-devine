import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { TopAnnouncement } from "@/components/layout/TopAnnouncement";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";

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
    icon: "/images/logo.png",
    apple: "/images/logo.png",
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
              <Header />
              <CartDrawer />
              <main className="flex-1 w-full max-w-full overflow-x-hidden pb-16 sm:pb-0">{children}</main>
              <Footer />
              <MobileNav />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
