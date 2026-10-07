import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "efChamps // Play • Prove • Collect",
  description: "Put real stakes behind your eFootball skill. Challenge verified players, settle results securely, and let every goal mean more.",
};

import { AuthProvider } from "./lib/auth-context";

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col bg-[#07080a] text-white selection:bg-[#00FF66] selection:text-[#06150c]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
