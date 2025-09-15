"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: string;
  handle: string;
  title: string;
  tags?: string[];
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange?: { minVariantPrice?: { amount?: string; currencyCode?: string } };
};

const TABS = [
  { key: "all", label: "All" },
  { key: "t-shirt", label: "T-Shirts" },
  { key: "longsleeve", label: "Longsleeves" },
  { key: "hoodie", label: "Hoodies" },
] as const;

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const gridRef = useRef<HTMLUListElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialProducts.filter((p) => {
      const matchesText = !q || p.title.toLowerCase().includes(q);
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      const matchesTab =
        tab === "all" ||
        (tab === "t-shirt" && (tags.includes("t-shirt") || tags.includes("tee"))) ||
        // Treat all products as Longsleeves for now
        (tab === "longsleeve" && true) ||
        (tab === "hoodie" && tags.includes("hoodie"));
      return matchesText && matchesTab;
    });
  }, [initialProducts, query, tab]);

  // Trigger a smooth fade for grid when filters change (no scrolling)
  useEffect(() => {
    // start exit state
    setIsTransitioning(true);
    const id = setTimeout(() => {
      // after a tick, enter state
      setIsTransitioning(false);
    }, 30);
    return () => clearTimeout(id);
  }, [tab, query]);

  // Update sliding indicator position
  useEffect(() => {
    const container = tabsRef.current;
    const activeBtn = btnRefs.current[tab];
    if (!container || !activeBtn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
  }, [tab]);

  useEffect(() => {
    const onResize = () => {
      const container = tabsRef.current;
      const activeBtn = btnRefs.current[tab];
      if (!container || !activeBtn) return;
      const cRect = container.getBoundingClientRect();
      const bRect = activeBtn.getBoundingClientRect();
      setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [tab]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div ref={tabsRef} className="relative inline-flex items-center gap-1 rounded border border-white/15 bg-black/40 p-1">
          {/* Sliding indicator */}
          <div
            className="absolute top-1 bottom-1 rounded bg-white transition-all duration-300"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {TABS.map((t) => (
            <button
              key={t.key}
              ref={(el) => (btnRefs.current[t.key] = el)}
              onClick={() => setTab(t.key)}
              className={`relative z-10 px-3 py-1.5 text-sm rounded transition-colors ${
                tab === t.key ? "text-black" : "text-white/80 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-72 rounded border border-white/15 bg-black/40 px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <ul
        ref={gridRef}
        suppressHydrationWarning={true}
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300 ${
          isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {filtered.map((p) => (
          <li key={p.id} className="group" suppressHydrationWarning={true}>
            <Link href={`/product/${p.handle}`} className="block" suppressHydrationWarning={true}>
              {p.featuredImage && (
                <Image
                  src={p.featuredImage.url}
                  alt={p.featuredImage.altText || p.title}
                  width={600}
                  height={800}
                  className="aspect-[3/4] object-cover rounded border border-white/10 group-hover:opacity-90 transition"
                />
              )}
              <div className="mt-3">
                <p className="text-sm uppercase tracking-wide">{p.title}</p>
                <p className="text-sm text-white/60">
                  {p.priceRange?.minVariantPrice?.amount} {p.priceRange?.minVariantPrice?.currencyCode}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


