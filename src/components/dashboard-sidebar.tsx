"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/inquiries", label: "Inquiries" },
  { href: "/dashboard/profile", label: "Profile" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      aria-label="Dashboard navigation"
      className={cn(
        "hidden md:flex md:flex-col md:border-r md:border-border-subtle md:bg-bg-surface md:transition-all",
        collapsed ? "md:w-20" : "md:w-60"
      )}
    >
      <div className="flex h-20 items-center border-b border-border-subtle px-5">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 border border-accent/20 text-xs font-mono">
            T
          </span>
          {!collapsed && <span>Tabula</span>}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-accent/10 text-accent border border-accent/15"
                : "text-text-muted hover:text-text-primary hover:bg-bg-glass"
            )}
          >
            <span className="text-base" aria-hidden="true">
              {item.label === "Overview"
                ? "□"
                : item.label === "Projects"
                  ? "⊞"
                  : item.label === "Inquiries"
                    ? "✉"
                    : "⚙"}
            </span>
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border-subtle p-3">
        <button
          onClick={() => signOut()}
          aria-label="Sign out"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-colors hover:text-text-primary hover:bg-bg-glass"
        >
          <span aria-hidden="true">↩</span>
          {!collapsed && "Sign out"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-colors hover:text-text-primary hover:bg-bg-glass"
        >
          <span aria-hidden="true">{collapsed ? "→" : "←"}</span>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
