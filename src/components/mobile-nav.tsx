"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on pathname change and restore focus
  useEffect(() => {
    if (open) {
      setOpen(false);
      toggleRef.current?.focus();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Focus management: move focus to first link when opening
  useEffect(() => {
    if (open && panelRef.current) {
      const firstLink = panelRef.current.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }
  }, [open]);

  // Focus trap + Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }

    if (e.key !== "Tab" || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-bg-glass"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="fixed inset-0 top-20 z-40 bg-bg-primary/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav className="flex flex-col gap-2 p-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-lg font-medium text-text-muted hover:bg-bg-glass hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4 border-border-subtle" />
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-accent px-4 py-3 text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="rounded-xl px-4 py-3 text-center text-lg font-medium text-text-muted hover:bg-bg-glass focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  Sign in
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl bg-accent px-4 py-3 text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
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
