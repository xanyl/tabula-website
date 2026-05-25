"use client";

import { useState, useEffect, useCallback } from "react";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light") return false;
  } catch { /* localStorage unavailable */ }
  return true;
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    setDark(getInitialDark());
  }, []);

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch { /* localStorage unavailable */ }
  }, [dark]);

  // Before mount, render the server default (dark) to avoid hydration mismatch.
  // After mount, the real preference from localStorage takes over.
  const label = mounted
    ? dark ? "Switch to light mode" : "Switch to dark mode"
    : "Switch to light mode";
  const icon = mounted ? (dark ? "☀" : "☾") : "☀";

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm transition-colors hover:bg-white/[0.06]"
      aria-label={label}
    >
      {icon}
    </button>
  );
}
