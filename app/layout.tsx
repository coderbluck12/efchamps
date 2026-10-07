import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./lib/auth-context";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://efchamps.app";

export const viewport: Viewport = {
  themeColor: "#0C0D10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "efChamps // Competitive eFootball P2P Staking & Esports Tournaments",
    template: "%s // efChamps",
  },
  description:
    "Nigeria's premier competitive eFootball and digital football esports platform. Challenge verified players on PS5, Xbox, PC & Mobile, lock stakes in secure escrow, and win real cash prizes.",
  applicationName: "efChamps",
  authors: [{ name: "efChamps Esports Team", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "eFootball staking",
    "eFootball tournaments Nigeria",
    "PES betting",
    "eFootball cash challenges",
    "esports skill gaming",
    "FIFA staking",
    "FIFA tournaments Lagos",
    "PS5 eFootball challenges",
    "Xbox eFootball wagers",
    "eFootball mobile cash tournament",
    "peer to peer esports",
    "closed loop escrow gaming",
  ],
  referrer: "origin-when-cross-origin",
  creator: "efChamps Interactive",
  publisher: "efChamps Interactive",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "efChamps // Play • Prove • Collect",
    description:
      "Competitive peer-to-peer eFootball challenges and esports tournaments. Put stakes behind your skill and withdraw instantly to your bank account.",
    url: siteUrl,
    siteName: "efChamps",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "efChamps // Competitive eFootball Staking & Tournaments",
    description:
      "Skill-based eFootball challenges with guaranteed escrow payouts on PS5, Xbox, PC & Mobile.",
    creator: "@efChampsApp",
  },
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
  category: "gaming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "efChamps",
        "description": "Competitive eFootball peer-to-peer staking and tournament platform",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/dashboard?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "efChamps",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "sameAs": [
          "https://twitter.com/efChampsApp",
          "https://instagram.com/efChampsApp"
        ]
      },
      {
        "@type": "VideoGame",
        "name": "eFootball Esports Competition",
        "gamePlatform": ["PlayStation 5", "Xbox Series X", "PC", "Mobile"],
        "genre": ["Sports", "eSports", "Soccer", "Football Simulation"]
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#07080a] text-white selection:bg-[#00FF66] selection:text-[#06150c]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
