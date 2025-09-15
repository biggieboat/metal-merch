import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AnnouncementBar from "./AnnouncementBar";
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <AnnouncementBar />
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--muted)]/90 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between" suppressHydrationWarning={true}>
            <Link href="/" className="text-xl font-bold tracking-tight text-[var(--primary)] hover:text-[var(--accent-foreground)] transition-colors">
              {process.env.SITE_NAME || "Obsidian Cult Merch"}
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Shop</Link>
              <Link href="/cart" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Cart</Link>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-6xl" suppressHydrationWarning={true}>{children}</div>
        <footer className="mt-16 border-t border-[var(--border)] py-10 text-center text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} {process.env.SITE_NAME || "Obsidian Cult Merch"}
        </footer>
      </body>
    </html>
  );
}
