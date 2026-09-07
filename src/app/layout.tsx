import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import { HeroLoadingProvider } from "@/components/HeroLoadingContext";
import Script from "next/script";

// ─── Custom SVG Icons (Simple Hut, Teal Theme Colors) ───
// Favicon SVG (scalable, transparent background)
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="url(#tealGrad)"/>
  <!-- Simple Hut - Roof -->
  <polygon points="20,42 50,16 80,42" fill="#FFFFFF"/>
  <!-- Simple Hut - Body -->
  <rect x="28" y="42" width="44" height="36" rx="3" fill="#FFFFFF"/>
  <!-- Simple Door -->
  <rect x="44" y="58" width="12" height="20" rx="2" fill="#0d9488"/>
</svg>
`;

// Apple Touch Icon SVG (opaque, rounded corners)
const appleIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="appleTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="40" fill="url(#appleTealGrad)"/>
  <!-- Simple Hut - Roof (scaled) -->
  <polygon points="36,76 90,30 144,76" fill="#FFFFFF"/>
  <!-- Simple Hut - Body -->
  <rect x="50" y="76" width="80" height="64" rx="4" fill="#FFFFFF"/>
  <!-- Simple Door -->
  <rect x="79" y="104" width="22" height="36" rx="3" fill="#0d9488"/>
</svg>
`;

// Data URLs
const faviconDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(faviconSvg)}`;
const appleIconDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(appleIconSvg)}`;

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
        // Absolute URL to ensure it works even if metadataBase is ignored
        url: "https://zainserenity.vercel.app/images/og-image.jpg",
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
    site: "@serenity",
    creator: "@zainshah",
    images: ["https://zainserenity.vercel.app/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: faviconDataUrl, type: "image/svg+xml", sizes: "any" },
      { url: faviconDataUrl, type: "image/svg+xml", sizes: "16x16" },
      { url: faviconDataUrl, type: "image/svg+xml", sizes: "32x32" },
      { url: faviconDataUrl, type: "image/svg+xml", sizes: "48x48" },
      { url: faviconDataUrl, type: "image/svg+xml", sizes: "192x192" },
      { url: faviconDataUrl, type: "image/svg+xml", sizes: "512x512" },
    ],
    apple: [
      { url: appleIconDataUrl, sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: faviconDataUrl,
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
        {/* GA4 Tracking Scripts */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <HeroLoadingProvider>
          <Providers>
            <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
          </Providers>
        </HeroLoadingProvider>
      </body>
    </html>
  );
}