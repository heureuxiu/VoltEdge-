import type { Metadata, Viewport } from "next";
import { Archivo, Inter, Space_Grotesk } from "next/font/google";

import { ChromeGate } from "@/components/layout/ChromeGate";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { fetchCatalog } from "@/lib/catalog.server";
import { siteConfig } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const catalog = await fetchCatalog();
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${archivo.variable}`}>
      <body className="min-h-dvh">
        <CatalogProvider catalog={catalog}>
          <CartProvider>
            <SmoothScroll />
            <ChromeGate>
              <AnnouncementBar />
              <Header />
            </ChromeGate>
            <main id="top">{children}</main>
            <ChromeGate>
              <Footer />
              <WhatsAppButton />
            </ChromeGate>
          </CartProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
