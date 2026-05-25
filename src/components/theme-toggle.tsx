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
  const [dark, setDark] = useState(getInitialDark);

  // Sync the class on mount in case it was set by an inline script
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark !== dark) {
      setDark(isDark);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch { /* localStorage unavailable */ }
  }, [dark]);

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm transition-colors hover:bg-white/[0.06]"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
