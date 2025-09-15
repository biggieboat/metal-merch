import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.SITE_NAME || "Obsidian Cult Merch",
  description: process.env.SITE_DESCRIPTION || "Black & death metal shirts and longsleeves",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-gray-100`}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              {process.env.SITE_NAME || "Obsidian Cult Merch"}
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-white">Shop</Link>
              <Link href="/cart" className="hover:text-white">Cart</Link>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-6xl">{children}</div>
        <footer className="mt-16 border-t border-white/10 py-10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {process.env.SITE_NAME || "Obsidian Cult Merch"}
        </footer>
      </body>
    </html>
  );
}
