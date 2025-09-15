"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "announcement_dismissed_v1";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const dismissed = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
      if (dismissed === "1") setVisible(false);
    } catch {}
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-[var(--accent)] text-[var(--accent-foreground)] text-center py-2 text-sm font-medium relative">
      <div className="mx-auto max-w-6xl px-6">
        🚚 Free shipping on orders over $150
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => {
          setVisible(false);
          try {
            window.localStorage.setItem(STORAGE_KEY, "1");
          } catch {}
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-[var(--accent-foreground)]/70 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
      >
        ×
      </button>
    </div>
  );
}


