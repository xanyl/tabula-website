"use client";

import { useState, useEffect, useCallback } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch { /* localStorage unavailable */ }
  }, [dark, mounted]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  if (!mounted) {
    return (
      <button
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] text-sm"
        aria-label="Loading theme"
      >
        ☀
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.03] text-sm transition-colors hover:bg-black/[0.06] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
