import Link from "next/link";
import { auth } from "@/lib/auth";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg-primary/60 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 border border-accent/20 text-sm font-mono shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            T
          </span>
          Tabula
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.22)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Sign in
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.22)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start a conversation
              </Link>
            </>
          )}
        </div>

        <MobileNav session={session} />
      </div>
    </header>
  );
}
