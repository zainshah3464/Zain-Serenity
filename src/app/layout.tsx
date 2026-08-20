import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import { HeroLoadingProvider } from "@/components/HeroLoadingContext"; // ← Import added

// ─── Professional Metadata ───────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://zainserenity.vercel.app"),
  title: {
    default: "Zain's Serenity | Luxury Coastal Retreat in Crystal Cove",
    template: "%s | Zain's Serenity",
  },
  description:
    "Experience timeless elegance at Zain's Serenity – a luxury eco‑resort on the Crystal Coast of Mauritius. Overwater spa, private beach, and world‑class dining await.",
  keywords: [
    "luxury resort Mauritius",
    "Zain's Serenity",
    "Crystal Cove",
    "eco resort",
    "beach villa",
    "overwater spa",
    "private marina",
    "5 star hotel Mauritius",
    "Zain Shah",
  ],
  authors: [{ name: "Zain Shah", url: "https://zain-main-web.vercel.app/" }],
  creator: "Zain Shah",
  publisher: "Zain's Serenity",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    type: "website",
    url: "https://zainserenity.vercel.app",
    siteName: "Zain's Serenity",
    title: "Zain's Serenity | Luxury Coastal Retreat",
    description:
      "A luxury eco‑resort on the Crystal Coast of Mauritius. Overwater spa, private beach, and world‑class dining.",
    images: [
      {
        url: "/images/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Zain's Serenity – Luxury Coastal Retreat",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zain's Serenity | Luxury Coastal Retreat",
    description:
      "Luxury eco‑resort in Mauritius with overwater spa, private beach, and world‑class dining.",
    site: "@serenity", // ⚠️ Apna Twitter handle
    creator: "@zainshah",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico", sizes: "any" },
      { url: "/images/favicon/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicon/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/images/favicon/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/images/favicon/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/images/favicon/favicon.ico",
  },
  manifest: "/images/favicon/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "travel",
  classification: "Luxury Resort",
};

// ─── Viewport & Theme ────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d9488", // teal-600
  colorScheme: "light",
};

// ─── Root Layout ─────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-white via-green-50/10 to-gray-50 text-gray-800 antialiased">
        <HeroLoadingProvider>
          <Providers>
            <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
          </Providers>
        </HeroLoadingProvider>
      </body>
    </html>
  );
}