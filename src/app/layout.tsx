import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "गौतम एकता साधना",
  description: "गुरु प्रेरणा से एकता की साधना — Gautam Labdhi Foundation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FF9933" />
      </head>
      <body className="min-h-full flex flex-col bg-spiritual-bg" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
        <AuthProvider>
          <main className="flex-1 pb-20">{children}</main>
          <Navbar />
        </AuthProvider>
      </body>
    </html>
  );
}
