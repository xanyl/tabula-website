"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";

const links = [
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function MobileNav({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 top-20 z-40 bg-bg-primary/95 backdrop-blur-xl">
          <nav className="flex flex-col gap-2 p-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-lg font-medium text-text-muted hover:bg-white/[0.04] hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4 border-white/[0.06]" />
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-accent px-4 py-3 text-center text-lg font-semibold text-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="rounded-xl px-4 py-3 text-center text-lg font-medium text-text-muted hover:bg-white/[0.04]"
                >
                  Sign in
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl bg-accent px-4 py-3 text-center text-lg font-semibold text-white"
                >
                  Start a conversation
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
