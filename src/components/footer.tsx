import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 border border-accent/20 text-xs font-mono">
              T
            </span>
            Tabula
          </div>
          <p className="text-lg text-text-primary/90">
            Where workflows become intelligent
          </p>
          <p className="max-w-md text-sm text-text-muted">
            Tabula helps companies transform manual workflows into automated,
            intelligent systems using practical AI.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Navigate
          </h2>
          <div className="grid gap-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1200px] px-8 text-xs text-text-muted">
        &copy; {new Date().getFullYear()} Tabula. All rights reserved.
      </div>
    </footer>
  );
}
