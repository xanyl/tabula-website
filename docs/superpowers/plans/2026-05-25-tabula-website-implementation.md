# Tabula Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Tabula website from a single index.html into a production Next.js 15 application with auth, database, contact system, blog, case studies, and creative animations.

**Architecture:** Next.js 15 App Router with three route groups (marketing, auth, dashboard). Server components by default, client components only as interactive leaf nodes. PostgreSQL via Prisma, NextAuth.js v5 for auth, Framer Motion for animations, Tailwind CSS 4 for styling.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind CSS 4, Framer Motion, NextAuth.js v5, Prisma, PostgreSQL, Resend, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-05-25-tabula-website-redesign.md`

---

## Phase 1: Project Scaffold → Working "Hello World"

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `tailwind.config.ts`

- [ ] **Step 1: Scaffold with create-next-app**

```bash
cd C:\Users\anilt\tabula-website
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --turbopack
```
Expected: Project scaffolds, asks to overwrite existing index.html — choose "yes".

- [ ] **Step 2: Install core dependencies**

```bash
pnpm add next-auth@beta @auth/prisma-adapter prisma @prisma/client resend framer-motion clsx
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom @playwright/test
```

- [ ] **Step 3: Verify dev server runs**

```bash
pnpm dev
```
Open http://localhost:3000. Expected: Next.js welcome page with Tailwind styles.

- [ ] **Step 4: Clean up boilerplate**

Remove default Next.js welcome content from `src/app/page.tsx`. Replace with minimal:

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center">
      <h1 className="text-4xl font-bold">Tabula</h1>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js project with dependencies

🤖 Generated with Claude Code"
```

---

### Task 2: Tailwind config — design tokens

**Files:**
- Create: `src/styles/globals.css`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace tailwind.config.ts with Tabula design tokens**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#09090B",
          surface: "#131316",
          elevated: "#1A1A1F",
        },
        text: {
          primary: "#FAFAFA",
          muted: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#6366F1",
          glow: "rgba(99,102,241,0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out",
        marquee: "marquee 20s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 2: Write globals.css**

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  --color-bg-primary: #09090B;
  --color-bg-surface: #131316;
  --color-bg-elevated: #1A1A1F;
  --color-text-primary: #FAFAFA;
  --color-text-muted: #A1A1AA;
  --color-accent: #6366F1;
  --color-accent-glow: rgba(99, 102, 241, 0.35);
}

body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Dot grid background texture */
.dot-grid {
  background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 70%);
}

/* Grain overlay */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 256px 256px;
}

/* Section reveal */
.section-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.section-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/styles/globals.css
git commit -m "feat: add Tabula design tokens and global styles

🤖 Generated with Claude Code"
```

---

## Phase 2: Fonts & Root Layout

### Task 3: Root layout with fonts and providers

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create utils with cn helper**

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
```

- [ ] **Step 2: Write root layout with Inter + Instrument Serif**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400", "400"],
  variable: "--font-instrument-serif",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Tabula — Where workflows become intelligent",
    template: "%s | Tabula",
  },
  description:
    "Tabula helps companies transform manual workflows into automated, intelligent systems using practical AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify fonts load**

```bash
pnpm dev
```
Open http://localhost:3000. Check DevTools > Network for font files. Expected: Inter and Instrument Serif loaded.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/lib/utils.ts
git commit -m "feat: add root layout with Inter and Instrument Serif fonts

🤖 Generated with Claude Code"
```

---

## Phase 3: Database & Auth

### Task 4: Prisma schema and initial migration

**Files:**
- Create: `prisma/schema.prisma`, `.env`

- [ ] **Step 1: Write Prisma schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String           @id @default(cuid())
  name          String?
  email         String           @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  accounts      Account[]
  sessions      Session[]
  inquiries     ContactInquiry[]
  projects      Project[]
  posts         BlogPost[]
  caseStudies   CaseStudy[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum InquiryStatus {
  NEW
  IN_REVIEW
  RESPONDED
}

model ContactInquiry {
  id        String        @id @default(cuid())
  name      String
  email     String
  company   String?
  message   String
  status    InquiryStatus @default(NEW)
  createdAt DateTime      @default(now())
  userId    String?
  user      User?         @relation(fields: [userId], references: [id])

  @@index([email])
  @@index([status])
}

enum ProjectStatus {
  DISCOVERY
  DESIGN
  BUILD
  REFINE
  COMPLETE
}

model Project {
  id          String        @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(DISCOVERY)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  userId      String
  user        User          @relation(fields: [userId], references: [id])

  @@index([userId])
}

model BlogPost {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     String
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  authorId    String?
  author      User?     @relation(fields: [authorId], references: [id])
}

model CaseStudy {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     String
  metrics     Json
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  authorId    String?
  author      User?     @relation(fields: [authorId], references: [id])
}
```

- [ ] **Step 2: Create .env**

```bash
# .env
DATABASE_URL="postgresql://localhost:5432/tabula"
AUTH_SECRET="generate-this-with: openssl rand -base64 32"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
RESEND_API_KEY=""
CONTACT_EMAIL="hello@tabula.ai"
```

- [ ] **Step 3: Run Prisma generate and initial migration**

```bash
npx prisma generate
npx prisma migrate dev --name init
```
Expected: Migration created successfully. Tables exist in PostgreSQL.

- [ ] **Step 4: Create Prisma client singleton**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma .env src/lib/prisma.ts
git commit -m "feat: add Prisma schema and database client

🤖 Generated with Claude Code"
```

---

### Task 5: NextAuth.js configuration

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`
- Modify: `.env`

- [ ] **Step 1: Write auth configuration**

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Resend({
      from: process.env.CONTACT_EMAIL!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
```

- [ ] **Step 2: Write NextAuth.js API route**

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Write middleware**

```typescript
// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoggedIn = !!req.auth;

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/ src/middleware.ts
git commit -m "feat: add NextAuth.js configuration with Google, GitHub, and Resend

🤖 Generated with Claude Code"
```

---

## Phase 4: Marketing Layout & Shared Components

### Task 6: Marketing layout — Navbar + Footer

**Files:**
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/components/navbar.tsx`
- Create: `src/components/footer.tsx`
- Create: `src/components/mobile-nav.tsx`
- Create: `src/components/theme-toggle.tsx`

- [ ] **Step 1: Write Navbar component**

```tsx
// src/components/navbar.tsx
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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg-primary/60 backdrop-blur-xl">
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
```

- [ ] **Step 2: Write MobileNav component**

```tsx
"use client";
// src/components/mobile-nav.tsx
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
```

- [ ] **Step 3: Write ThemeToggle component**

```tsx
"use client";
// src/components/theme-toggle.tsx
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

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
```

- [ ] **Step 4: Write Footer component**

```tsx
// src/components/footer.tsx
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
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Navigate
          </p>
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
```

- [ ] **Step 5: Write marketing layout**

```tsx
// src/app/(marketing)/layout.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Verify — visit http://localhost:3000**

Expected: Navbar at top, footer at bottom. Mobile menu works at < 768px. Theme toggle switches dark/light.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(marketing\)/ src/components/navbar.tsx src/components/footer.tsx src/components/mobile-nav.tsx src/components/theme-toggle.tsx
git commit -m "feat: add marketing layout with navbar, footer, mobile nav, and theme toggle

🤖 Generated with Claude Code"
```

---

## Phase 5: Homepage — Creative Sections

### Task 7: Hero section with canvas particle system

**Files:**
- Create: `src/components/hero.tsx`
- Create: `src/components/particle-canvas.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write ParticleCanvas component**

```tsx
"use client";
// src/components/particle-canvas.tsx
import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  alpha: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const scrollRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 200;
      particles.push({
        x: cx + Math.cos(angle) * dist * 3,
        y: cy + Math.sin(angle) * dist * 3,
        vx: 0,
        vy: 0,
        targetX: cx + Math.cos(angle) * dist,
        targetY: cy + Math.sin(angle) * dist,
        radius: 1 + Math.random() * 2,
        alpha: 0.4 + Math.random() * 0.6,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement!.offsetWidth;
      canvas.height = canvas.parentElement!.offsetHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const { x: mx, y: my } = mouseRef.current;

      for (const p of particles) {
        // Attract toward target position (structured T formation)
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        p.vx += dx * 0.003;
        p.vy += dy * 0.003;

        // Repel from cursor
        const cdx = p.x - mx;
        const cdy = p.y - my;
        const cursorDist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (cursorDist < 120) {
          p.vx += (cdx / cursorDist) * 0.5;
          p.vy += (cdy / cursorDist) * 0.5;
        }

        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.fill();
      }

      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [initParticles]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
```

- [ ] **Step 2: Write Hero section**

```tsx
// src/components/hero.tsx
import Link from "next/link";
import { ParticleCanvas } from "@/components/particle-canvas";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      <ParticleCanvas />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.12),transparent_60%)] dot-grid" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-8 text-center">
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/25 font-mono text-2xl font-bold text-accent shadow-[0_0_60px_rgba(99,102,241,0.3)] animate-float">
            T
          </div>
        </div>

        <h1 className="mx-auto max-w-[10ch] font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.05em]">
          <span className="bg-gradient-to-b from-white via-white to-indigo-300 bg-clip-text text-transparent">
            Turn chaos into clarity.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[48ch] text-[clamp(1rem,1.5vw,1.12rem)] text-text-muted">
          Tabula transforms manual workflows into intelligent systems using
          practical AI — built for companies with real operational complexity.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(99,102,241,0.25)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Start a conversation
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-text-primary transition-all hover:-translate-y-0.5 hover:border-white/[0.14] active:scale-[0.98]"
          >
            See how it works
          </Link>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-sm text-text-muted">
          <span>Practical AI, not hype</span>
          <span className="text-white/40">|</span>
          <span>Built around real workflows</span>
          <span className="text-white/40">|</span>
          <span>Designed for operational clarity</span>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire homepage to use Hero**

```tsx
// src/app/(marketing)/page.tsx
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 4: Verify at http://localhost:3000**

Expected: Full-screen hero with particle animation. Particles react to cursor movement. Floating T mark with glow.

- [ ] **Step 5: Commit**

```bash
git add src/components/hero.tsx src/components/particle-canvas.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add hero section with canvas particle system

🤖 Generated with Claude Code"
```

---

### Task 8: Before/After problem section

**Files:**
- Create: `src/components/problem-section.tsx`
- Create: `src/components/scroll-reveal.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write ScrollReveal wrapper**

```tsx
"use client";
// src/components/scroll-reveal.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Write ProblemSection**

```tsx
"use client";
// src/components/problem-section.tsx
import { ScrollReveal } from "@/components/scroll-reveal";

const beforeItems = [
  "Manual email triage",
  "Spreadsheet approvals",
  "Endless handoffs",
  "No process visibility",
];

const afterItems = [
  "Auto-routed to right person",
  "One-click approvals",
  "AI handles triage",
  "Full audit trail",
];

export function ProblemSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <ScrollReveal className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            The Problem
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            Manual workflows are invisible friction.
          </h2>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Before */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
                Without Tabula
              </p>
              <div className="space-y-3">
                {beforeItems.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-dashed border-white/[0.08] px-5 py-4 text-sm text-text-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* After */}
          <ScrollReveal delay={0.25}>
            <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-accent/[0.02] p-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                With Tabula
              </p>
              <div className="space-y-3">
                {afterItems.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-accent/15 bg-accent/[0.03] px-5 py-4 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to homepage**

```tsx
// src/app/(marketing)/page.tsx
import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
    </main>
  );
}
```

- [ ] **Step 4: Verify at http://localhost:3000**

Scroll down from hero. Expected: Before/After split screen fades up on scroll. Left side has dashed borders (chaotic), right side has accent borders (structured).

- [ ] **Step 5: Commit**

```bash
git add src/components/problem-section.tsx src/components/scroll-reveal.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add before/after problem section with scroll reveal animation

🤖 Generated with Claude Code"
```

---

### Task 9: Process timeline section

**Files:**
- Create: `src/components/process-timeline.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write ProcessTimeline**

```tsx
"use client";
// src/components/process-timeline.tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Diagnose",
    desc: "Map where time is lost, where teams wait, and where manual decisions slow the business down.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Shape a system around the actual process instead of forcing the business into generic software.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Implement the workflow, AI touchpoints, and integrations that automate the work.",
  },
  {
    num: "04",
    title: "Refine",
    desc: "Adjust based on real usage so the system becomes durable, usable, and scalable.",
  },
];

function TimelineStep({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-20 pb-14 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Dot on the line */}
      <motion.div
        className="absolute left-[18px] top-1 h-[17px] w-[17px] rounded-full border-2 border-accent bg-bg-surface"
        animate={isInView ? { backgroundColor: "#6366F1", boxShadow: "0 0 30px rgba(99,102,241,0.6)" } : {}}
        transition={{ delay: index * 0.1 + 0.3 }}
      />

      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
        {step.num} — {step.title}
      </p>
      <p className="mt-2 max-w-lg text-text-muted">{step.desc}</p>
    </motion.div>
  );
}

export function ProcessTimeline() {
  return (
    <section id="how-it-works" className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            How It Works
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            A clear path from friction to intelligent execution.
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto max-w-2xl">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-0 h-full w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />

          {steps.map((step, i) => (
            <TimelineStep key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage**

```tsx
// Add to the imports and component in src/app/(marketing)/page.tsx
import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { ProcessTimeline } from "@/components/process-timeline";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <ProcessTimeline />
    </main>
  );
}
```

- [ ] **Step 3: Verify**

Scroll to process section. Expected: Vertical indigo line with 4 dots. Each dot pulses with glow when it scrolls into view. Steps fade in from left.

- [ ] **Step 4: Commit**

```bash
git add src/components/process-timeline.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add animated process timeline section

🤖 Generated with Claude Code"
```

---

### Task 10: Services bento grid section

**Files:**
- Create: `src/components/services-section.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write ServicesSection**

```tsx
"use client";
// src/components/services-section.tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    label: "Flagship Service",
    title: "AI Opportunity Audit",
    desc: "Before you invest in the wrong tools, we identify where AI and automation create the biggest operational impact. You get a prioritized roadmap — not a list of buzzwords.",
    tags: ["Workflow mapping", "Bottleneck analysis", "ROI prioritization"],
    large: true,
  },
  {
    label: "Build",
    title: "Workflow Automation",
    desc: "Replace manual coordination, approvals, and handoffs with systems that run themselves.",
  },
  {
    label: "Build",
    title: "Custom AI Apps",
    desc: "Internal tools, copilots, and interfaces built around how your team actually works.",
  },
  {
    label: "Advanced",
    title: "Agentic Workflow Systems",
    desc: "Multi-step AI systems that coordinate actions, support decisions, and manage complex process flows — with human oversight built in.",
    wide: true,
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={`group rounded-2xl border border-white/[0.06] bg-bg-surface p-8 transition-colors hover:border-white/[0.12] ${
        service.large ? "md:row-span-2" : ""
      } ${service.wide ? "md:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{
        background: service.large
          ? "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))"
          : undefined,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
        {service.label}
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">
        {service.title}
      </h3>
      <p className="mt-2 text-sm text-text-muted">{service.desc}</p>
      {service.tags && (
        <div className="mt-5 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export function ServicesSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Services
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            What Tabula builds.
          </h2>
          <p className="mx-auto mt-4 max-w-[48ch] text-text-muted">
            We focus on workflow transformation first. Technology follows the
            business problem, not the other way around.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr] md:grid-rows-[auto_auto]">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage**

Add `import { ServicesSection } from "@/components/services-section";` and `<ServicesSection />` after ProcessTimeline in page.tsx.

- [ ] **Step 3: Verify**

Expected: Asymmetric bento grid. AI Audit spans 2 rows in a 3-column grid. Cards fade up on scroll. Hover border brightens.

- [ ] **Step 4: Commit**

```bash
git add src/components/services-section.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add services asymmetric bento grid section

🤖 Generated with Claude Code"
```

---

### Task 11: Use cases — cursor-tracking cards

**Files:**
- Create: `src/components/use-cases-section.tsx`
- Create: `src/components/cursor-card.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write CursorCard**

```tsx
"use client";
// src/components/cursor-card.tsx
import { useRef, type MouseEvent } from "react";

export function CursorCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.transform = `perspective(800px) rotateY(${(x - 0.5) * 6}deg) rotateX(${(0.5 - y) * 6}deg)`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-default overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-surface p-8 transition-all duration-200"
      style={
        {
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties
      }
    >
      {/* Dynamic gradient that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--mx) var(--my), rgba(99,102,241,0.08), transparent 50%)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/15 text-lg">
          {icon}
        </div>
        <h3 className="text-lg font-semibold tracking-[-0.02em]">{title}</h3>
        <p className="mt-2 text-sm text-text-muted">{desc}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write UseCasesSection**

```tsx
// src/components/use-cases-section.tsx
import { ScrollReveal } from "@/components/scroll-reveal";
import { CursorCard } from "@/components/cursor-card";

const useCases = [
  {
    icon: "⚙",
    title: "Operations",
    desc: "Approvals, handoffs, reporting, multi-tool coordination — automated and visible.",
  },
  {
    icon: "👥",
    title: "Customer Workflows",
    desc: "Intake, triage, onboarding, routing, follow-up — intelligent and self-running.",
  },
  {
    icon: "📄",
    title: "Documents & Knowledge",
    desc: "Extraction, summarization, retrieval, action — across every document and form.",
  },
];

export function UseCasesSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <ScrollReveal className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
            Use Cases
          </p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            Workflows Tabula can transform.
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {useCases.map((uc, i) => (
            <ScrollReveal key={uc.title} delay={i * 0.1}>
              <CursorCard icon={uc.icon} title={uc.title} desc={uc.desc} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to homepage**

Add `<UseCasesSection />` after ServicesSection in page.tsx.

- [ ] **Step 4: Verify**

Hover over use case cards. Expected: Cards tilt in 3D following cursor. Radial gradient moves with mouse.

- [ ] **Step 5: Commit**

```bash
git add src/components/cursor-card.tsx src/components/use-cases-section.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add use cases section with cursor-tracking 3D cards

🤖 Generated with Claude Code"
```

---

### Task 12: Metrics and marquee section

**Files:**
- Create: `src/components/social-proof-section.tsx`
- Create: `src/components/animated-counter.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write AnimatedCounter**

```tsx
"use client";
// src/components/animated-counter.tsx
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  const [rendered, setRendered] = useState("0");

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setRendered(String(v)));
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      ref={ref}
      className="font-serif text-[clamp(3rem,6vw,5rem)] tracking-[-0.03em] bg-gradient-to-b from-white to-indigo-300 bg-clip-text text-transparent"
    >
      {rendered}
      {suffix}
    </motion.span>
  );
}
```

- [ ] **Step 2: Write SocialProofSection**

```tsx
// src/components/social-proof-section.tsx
import { AnimatedCounter } from "@/components/animated-counter";
import { ScrollReveal } from "@/components/scroll-reveal";

const metrics = [
  { value: 60, suffix: "%", label: "Less manual work" },
  { value: 3, suffix: "x", label: "Faster operations" },
  { value: 100, suffix: "%", label: "Process visibility" },
];

const marqueeItems = [
  "Workflow Transformation",
  "Practical AI",
  "Operational Clarity",
  "Intelligent Automation",
  "Human-in-the-Loop",
  "Cross-tool Integration",
  "Workflow Transformation",
  "Practical AI",
  "Operational Clarity",
  "Intelligent Automation",
  "Human-in-the-Loop",
  "Cross-tool Integration",
];

export function SocialProofSection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        {/* Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-16 border-y border-white/[0.06] py-20">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <ScrollReveal>
                <AnimatedCounter value={m.value} suffix={m.suffix} />
                <p className="mt-2 text-sm text-text-muted">{m.label}</p>
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="mt-16 overflow-hidden border-y border-white/[0.06] py-8">
          <div className="flex w-max animate-marquee gap-12">
            {marqueeItems.map((item, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-sm font-medium text-text-muted"
              >
                {item}
                {i < marqueeItems.length - 1 && (
                  <span className="ml-12 text-white/20">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to homepage**

Add `<SocialProofSection />` after UseCasesSection.

- [ ] **Step 4: Verify**

Scroll to metrics. Expected: Numbers count up from zero with spring animation. Marquee scrolls horizontally automatically.

- [ ] **Step 5: Commit**

```bash
git add src/components/animated-counter.tsx src/components/social-proof-section.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add social proof section with animated counters and marquee

🤖 Generated with Claude Code"
```

---

### Task 13: CTA section

**Files:**
- Create: `src/components/cta-section.tsx`
- Modify: `src/app/(marketing)/page.tsx`

- [ ] **Step 1: Write CTASection**

```tsx
// src/components/cta-section.tsx
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] p-16 text-center">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.06),transparent_50%)]" />

          <div className="relative z-10">
            <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.03em]">
              Ready to make your workflows intelligent?
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-white/70">
              If your company is spending too much time on manual, repetitive
              work, Tabula can turn that process into an automated system
              powered by practical AI.
            </p>

            <div className="mx-auto mt-8 flex max-w-md items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#1e1b4b] shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start a conversation
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/[0.1] active:scale-[0.98]"
              >
                Explore services
              </Link>
            </div>

            <p className="mt-6 text-xs text-white/50">
              Best fit for companies that want practical automation, clearer
              operations, and systems designed around real workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to homepage**

Add `<CTASection />` after SocialProofSection.

- [ ] **Step 3: Final homepage verification**

```bash
pnpm dev
```
Visit http://localhost:3000. Scroll through ALL sections:
1. Hero with particles
2. Before/After
3. Process timeline
4. Services bento grid
5. Use cases with tilt cards
6. Metrics + marquee
7. CTA with indigo gradient

- [ ] **Step 4: Commit**

```bash
git add src/components/cta-section.tsx src/app/\(marketing\)/page.tsx
git commit -m "feat: add CTA section and complete homepage

🤖 Generated with Claude Code"
```

---

## Phase 6: Auth Pages & Contact System

### Task 14: Auth pages (signin, signup, verify)

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/signin/page.tsx`
- Create: `src/app/(auth)/signup/page.tsx`
- Create: `src/app/(auth)/verify/page.tsx`
- Create: `src/components/sign-in-form.tsx`

- [ ] **Step 1: Write auth layout**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 border border-accent/20 font-mono text-lg font-bold text-accent">
            T
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write sign-in form**

```tsx
"use client";
// src/components/sign-in-form.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("resend", { email, redirect: false });
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-6 text-center">
        <p className="font-semibold">Check your email</p>
        <p className="mt-2 text-sm text-text-muted">
          We sent a magic link to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.06]"
      >
        Continue with Google
      </button>

      <button
        onClick={() => signIn("github")}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium transition-colors hover:bg-white/[0.06]"
      >
        Continue with GitHub
      </button>

      <div className="flex items-center gap-3">
        <hr className="flex-1 border-white/[0.06]" />
        <span className="text-xs text-text-muted">or</span>
        <hr className="flex-1 border-white/[0.06]" />
      </div>

      <form onSubmit={handleEmailSignIn}>
        <input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Write auth pages**

```tsx
// src/app/(auth)/signin/page.tsx
import { SignInForm } from "@/components/sign-in-form";

export default function SignInPage() {
  return (
    <>
      <h1 className="mb-6 text-center text-xl font-semibold tracking-[-0.02em]">
        Sign in to Tabula
      </h1>
      <SignInForm />
    </>
  );
}
```

```tsx
// src/app/(auth)/signup/page.tsx
import { redirect } from "next/navigation";

export default function SignUpPage() {
  redirect("/auth/signin");
}
```

```tsx
// src/app/(auth)/verify/page.tsx
export default function VerifyPage() {
  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-6 text-center">
      <p className="font-semibold">Check your email</p>
      <p className="mt-2 text-sm text-text-muted">
        We sent a verification link. Click it to sign in.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Verify auth flow**

Visit http://localhost:3000/auth/signin. Expected: Google + GitHub buttons + email input.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(auth\)/ src/components/sign-in-form.tsx
git commit -m "feat: add auth pages with Google, GitHub, and magic link sign-in

🤖 Generated with Claude Code"
```

---

### Task 15: Contact form with server action

**Files:**
- Create: `src/app/(marketing)/contact/page.tsx`
- Create: `src/lib/actions/contact.ts`
- Create: `src/components/contact-form.tsx`

- [ ] **Step 1: Write server action**

```typescript
"use server";
// src/lib/actions/contact.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = (formData.get("company") as string) || null;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const session = await auth();

  try {
    await prisma.contactInquiry.create({
      data: {
        name,
        email,
        company,
        message,
        userId: session?.user?.id || null,
      },
    });

    revalidatePath("/dashboard/inquiries");
    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
```

- [ ] **Step 2: Write ContactForm component**

```tsx
"use client";
// src/components/contact-form.tsx
import { useState, useRef } from "react";
import { submitContact } from "@/lib/actions/contact";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<{
    error?: string;
    success?: boolean;
  }>({});
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setState({});

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = await submitContact(formData);

    if (result.error) {
      setState({ error: result.error });
    } else {
      setState({ success: true });
      formRef.current?.reset();
    }
    setPending(false);
  };

  if (state.success) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent/[0.04] p-8 text-center">
        <p className="text-lg font-semibold">Message sent</p>
        <p className="mt-2 text-text-muted">
          We will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="company">
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none"
          placeholder="Company name (optional)"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="message">
          What are you working on?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm placeholder:text-text-muted focus:border-accent/30 focus:outline-none resize-none"
          placeholder="Tell us about your workflows, your team, and what you are trying to improve."
        />
      </div>

      {state.error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.22)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Write contact page**

```tsx
// src/app/(marketing)/contact/page.tsx
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent text-center">
            Start here
          </p>
          <h1 className="mt-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
            Start a conversation.
          </h1>
          <p className="mt-4 text-center text-text-muted">
            We start every engagement by understanding your workflows. No pitch,
            no pressure — just a conversation about what you are trying to
            improve.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify**

Visit http://localhost:3000/contact. Submit the form. Check the database for the entry. Expected: Form shows success message. Record in `ContactInquiry` table.

- [ ] **Step 5: Commit**

```bash
git add src/lib/actions/contact.ts src/components/contact-form.tsx src/app/\(marketing\)/contact/
git commit -m "feat: add contact form with server action and DB persistence

🤖 Generated with Claude Code"
```

---

## Phase 7: Dashboard

### Task 16: Dashboard layout with sidebar

**Files:**
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/components/dashboard-sidebar.tsx`
- Create: `src/components/session-provider.tsx`

- [ ] **Step 1: Write SessionProvider**

```tsx
"use client";
// src/components/session-provider.tsx
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

- [ ] **Step 2: Write DashboardSidebar**

```tsx
"use client";
// src/components/dashboard-sidebar.tsx
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
      className={cn(
        "hidden md:flex md:flex-col md:border-r md:border-white/[0.06] md:bg-bg-surface md:transition-all",
        collapsed ? "md:w-20" : "md:w-60"
      )}
    >
      <div className="flex h-20 items-center border-b border-white/[0.06] px-5">
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
              pathname === item.href
                ? "bg-accent/10 text-accent border border-accent/15"
                : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
            )}
          >
            <span className="text-base">
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

      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-colors hover:text-text-primary hover:bg-white/[0.03]"
        >
          <span>↩</span>
          {!collapsed && "Sign out"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-colors hover:text-text-primary hover:bg-white/[0.03]"
        >
          <span>{collapsed ? "→" : "←"}</span>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Write dashboard layout**

```tsx
// src/app/(dashboard)/layout.tsx
import { SessionProvider } from "@/components/session-provider";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-bg-primary">
        <DashboardSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(dashboard\)/layout.tsx src/components/dashboard-sidebar.tsx src/components/session-provider.tsx
git commit -m "feat: add dashboard layout with collapsible sidebar

🤖 Generated with Claude Code"
```

---

### Task 17: Dashboard pages (overview, projects, inquiries, profile)

**Files:**
- Create: `src/app/(dashboard)/page.tsx`
- Create: `src/app/(dashboard)/projects/page.tsx`
- Create: `src/app/(dashboard)/inquiries/page.tsx`
- Create: `src/app/(dashboard)/profile/page.tsx`

- [ ] **Step 1: Write dashboard overview**

```tsx
// src/app/(dashboard)/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardOverview() {
  const session = await auth();
  const userId = session?.user?.id;

  const [projectCount, inquiryCount] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.contactInquiry.count({
      where: userId ? { userId } : { email: session?.user?.email || "" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">
        Welcome back{", "}
        {session?.user?.name?.split(" ")[0] || "there"}.
      </h1>
      <p className="mt-1 text-text-muted">
        Here is an overview of your work with Tabula.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Active Projects
          </p>
          <p className="mt-2 font-serif text-4xl">{projectCount}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Inquiries
          </p>
          <p className="mt-2 font-serif text-4xl">{inquiryCount}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Status
          </p>
          <p className="mt-2 text-sm text-accent">Active</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write projects page**

```tsx
// src/app/(dashboard)/projects/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  DISCOVERY: "Discovery",
  DESIGN: "Design",
  BUILD: "Build",
  REFINE: "Refine",
  COMPLETE: "Complete",
};

export default async function ProjectsPage() {
  const session = await auth();
  const projects = await prisma.project.findMany({
    where: { userId: session?.user?.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Projects</h1>
      <p className="mt-1 text-text-muted">
        Track the status of your workflow transformations.
      </p>

      {projects.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-bg-surface p-12 text-center">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="mt-2 text-text-muted">
            Start a conversation to begin your first workflow transformation.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-bg-surface">
                <th className="px-6 py-3 text-left font-medium text-text-muted">
                  Project
                </th>
                <th className="px-6 py-3 text-left font-medium text-text-muted">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-text-muted">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/[0.04] last:border-0"
                >
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {statusLabels[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Write inquiries page**

```tsx
// src/app/(dashboard)/inquiries/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const statusLabels: Record<string, string> = {
  NEW: "New",
  IN_REVIEW: "In Review",
  RESPONDED: "Responded",
};

export default async function InquiriesPage() {
  const session = await auth();
  const inquiries = await prisma.contactInquiry.findMany({
    where: {
      OR: [
        { userId: session?.user?.id || undefined },
        { email: session?.user?.email || "" },
      ].filter((c) => Object.keys(c).length > 0),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Inquiries</h1>
      <p className="mt-1 text-text-muted">
        Your contact form submissions and their status.
      </p>

      {inquiries.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-bg-surface p-12 text-center">
          <p className="text-lg font-medium">No inquiries yet</p>
          <p className="mt-2 text-text-muted">
            Your contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-2xl border border-white/[0.06] bg-bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                  <p className="mt-1 text-sm text-text-muted">
                    {inquiry.message.slice(0, 100)}
                    {inquiry.message.length > 100 ? "..." : ""}
                  </p>
                </div>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {statusLabels[inquiry.status]}
                </span>
              </div>
              <p className="mt-3 text-xs text-text-muted">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Write profile page**

```tsx
// src/app/(dashboard)/profile/page.tsx
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-[-0.03em]">Profile</h1>
      <p className="mt-1 text-text-muted">Your account details.</p>

      <div className="mt-8 max-w-md space-y-4">
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Name
          </p>
          <p className="mt-1">{session?.user?.name || "Not set"}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Email
          </p>
          <p className="mt-1">{session?.user?.email}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Member since
          </p>
          <p className="mt-1">
            {session?.user?.id
              ? "Account active"
              : "Sign in to see account details"}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify dashboard**

Visit http://localhost:3000/dashboard (redirects to sign-in if not authenticated). Sign in via one of the providers. Expected: Sidebar with nav items, overview with stats, projects with empty state, inquiries with empty state, profile with user info.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(dashboard\)/
git commit -m "feat: add dashboard pages (overview, projects, inquiries, profile)

🤖 Generated with Claude Code"
```

---

## Phase 8: Blog & Case Studies

### Task 18: Blog listing and post pages

**Files:**
- Create: `src/app/(marketing)/blog/page.tsx`
- Create: `src/app/(marketing)/blog/[slug]/page.tsx`

- [ ] **Step 1: Write blog listing**

```tsx
// src/app/(marketing)/blog/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { title: true, slug: true, excerpt: true, publishedAt: true },
  });

  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Blog
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          Thoughts on workflow intelligence.
        </h1>

        {posts.length === 0 ? (
          <p className="mt-16 text-center text-text-muted">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-white/[0.06] bg-bg-surface p-6 transition-colors hover:border-white/[0.12]"
              >
                <p className="text-xs text-text-muted">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : ""}
                </p>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write blog post page**

```tsx
// src/app/(marketing)/blog/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) notFound();

  return (
    <article className="py-32">
      <div className="mx-auto max-w-[720px] px-8">
        <p className="text-xs text-text-muted">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Draft"}
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em] leading-tight">
          {post.title}
        </h1>
        <div className="mt-10 prose prose-invert prose-lg max-w-none">
          {post.content}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify**

Visit http://localhost:3000/blog. Expected: Empty state message. Insert a test post in DB and verify it renders.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(marketing\)/blog/
git commit -m "feat: add blog listing and post pages

🤖 Generated with Claude Code"
```

---

### Task 19: Case study pages

**Files:**
- Create: `src/app/(marketing)/case-studies/page.tsx`
- Create: `src/app/(marketing)/case-studies/[slug]/page.tsx`

- [ ] **Step 1: Write case study listing**

```tsx
// src/app/(marketing)/case-studies/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Case Studies" };
export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const studies = await prisma.caseStudy.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { title: true, slug: true, excerpt: true, metrics: true },
  });

  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Case Studies
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          Workflow transformations in practice.
        </h1>

        {studies.length === 0 ? (
          <p className="mt-16 text-center text-text-muted">
            Case studies coming soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {studies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group rounded-2xl border border-white/[0.06] bg-bg-surface p-8 transition-colors hover:border-white/[0.12]"
              >
                <h2 className="text-xl font-semibold tracking-[-0.02em] group-hover:text-accent transition-colors">
                  {study.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted">{study.excerpt}</p>
                {study.metrics && (
                  <div className="mt-5 flex gap-6">
                    {Object.entries(
                      study.metrics as Record<string, string>
                    ).map(([key, val]) => (
                      <div key={key}>
                        <p className="font-serif text-2xl text-accent">
                          {val}
                        </p>
                        <p className="text-xs text-text-muted">{key}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write case study post page**

```tsx
// src/app/(marketing)/case-studies/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!study) return { title: "Not Found" };
  return { title: study.title, description: study.excerpt };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await prisma.caseStudy.findUnique({ where: { slug } });
  if (!study) notFound();

  return (
    <article className="py-32">
      <div className="mx-auto max-w-[720px] px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Case Study
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em] leading-tight">
          {study.title}
        </h1>

        {study.metrics && (
          <div className="mt-8 flex flex-wrap gap-8 rounded-2xl border border-accent/20 bg-accent/[0.04] p-8">
            {Object.entries(study.metrics as Record<string, string>).map(
              ([key, val]) => (
                <div key={key}>
                  <p className="font-serif text-3xl text-accent">{val}</p>
                  <p className="mt-1 text-sm text-text-muted">{key}</p>
                </div>
              )
            )}
          </div>
        )}

        <div className="mt-10 prose prose-invert prose-lg max-w-none">
          {study.content}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/case-studies/
git commit -m "feat: add case study listing and detail pages

🤖 Generated with Claude Code"
```

---

### Task 20: Services and About pages

**Files:**
- Create: `src/app/(marketing)/services/page.tsx`
- Create: `src/app/(marketing)/about/page.tsx`

- [ ] **Step 1: Write services page**

```tsx
// src/app/(marketing)/services/page.tsx
export const metadata = { title: "Services" };

const services = [
  {
    title: "AI Opportunity Audit",
    desc: "Identify where AI and automation can create the biggest operational impact before investing in the wrong tools.",
    bullets: [
      "Workflow review and bottleneck mapping",
      "Automation opportunity prioritization",
      "Clear implementation roadmap",
    ],
  },
  {
    title: "Workflow Automation Builds",
    desc: "Replace repetitive coordination, approvals, reporting, and handoffs with systems that move work forward automatically.",
    bullets: [
      "Operational workflow design",
      "Cross-tool integrations",
      "AI-assisted process automation",
    ],
  },
  {
    title: "Custom AI Apps",
    desc: "Build internal tools and workflow-specific applications that match how your team actually operates.",
    bullets: [
      "Internal copilots and assistants",
      "Knowledge and document workflows",
      "Task-specific AI interfaces",
    ],
  },
  {
    title: "Agentic Workflow Systems",
    desc: "Create multi-step AI systems that can coordinate actions, support decisions, and manage more complex process flows.",
    bullets: [
      "Human-in-the-loop orchestration",
      "Multi-step task routing",
      "Operational AI agents",
    ],
  },
];

export default function ServicesPage() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[1200px] px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Services
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          What Tabula builds.
        </h1>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="rounded-2xl border border-white/[0.06] bg-bg-surface p-8"
            >
              <h2 className="text-xl font-semibold tracking-[-0.02em]">
                {svc.title}
              </h2>
              <p className="mt-2 text-text-muted">{svc.desc}</p>
              <ul className="mt-5 space-y-2">
                {svc.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-text-muted"
                  >
                    <span className="text-accent">→</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write about page**

```tsx
// src/app/(marketing)/about/page.tsx
export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-[720px] px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          About
        </p>
        <h1 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] tracking-[-0.03em]">
          We turn manual workflows into intelligent systems.
        </h1>

        <div className="mt-10 space-y-6 text-text-muted leading-relaxed">
          <p>
            Tabula was founded on a simple observation: most companies are held
            back not by a lack of effort, but by workflows that depend on
            repetitive manual work, fragmented information, and too much
            coordination.
          </p>
          <p>
            We help companies identify where manual work is slowing them down,
            then build the automation and AI systems that fix it. Our approach
            is practical — we design around real workflows, not AI hype.
          </p>
          <p>
            Every engagement starts with the workflow itself. We look at how
            work moves, where it stalls, and how AI can improve execution
            without adding unnecessary complexity.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Approach", value: "Workflow-first, technology-second" },
            { label: "Focus", value: "Operational complexity & practical AI" },
            { label: "Model", value: "Project-based, clear deliverables" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.06] bg-bg-surface p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                {item.label}
              </p>
              <p className="mt-2 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(marketing\)/services/ src/app/\(marketing\)/about/
git commit -m "feat: add services and about pages

🤖 Generated with Claude Code"
```

---

## Phase 9: Testing & CI

### Task 21: Playwright E2E tests

**Files:**
- Create: `e2e/homepage.spec.ts`
- Create: `e2e/auth.spec.ts`
- Create: `e2e/contact.spec.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Write Playwright config**

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 2: Write homepage E2E test**

```typescript
// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test("homepage renders all sections", async ({ page }) => {
  await page.goto("/");

  // Hero
  await expect(page.locator("h1")).toContainText("Turn chaos into clarity");

  // Navbar
  await expect(page.locator("header")).toBeVisible();

  // Scroll to problem section
  await page.locator("text=Manual workflows are invisible friction").scrollIntoViewIfNeeded();
  await expect(page.locator("text=Manual workflows are invisible friction")).toBeVisible();

  // Process timeline
  await page.locator("text=A clear path from friction to intelligent execution").scrollIntoViewIfNeeded();
  await expect(page.locator("text=A clear path from friction to intelligent execution")).toBeVisible();

  // Services
  await page.locator("text=What Tabula builds").scrollIntoViewIfNeeded();
  await expect(page.locator("text=AI Opportunity Audit")).toBeVisible();

  // CTA
  await page.locator("text=Ready to make your workflows intelligent").scrollIntoViewIfNeeded();
  await expect(page.locator("text=Ready to make your workflows intelligent")).toBeVisible();

  // Footer
  await expect(page.locator("footer")).toBeVisible();
});

test("mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.locator('button[aria-label="Open menu"]');
  await menuButton.click();
  await expect(page.locator("text=Services")).toBeVisible();

  await page.locator('button[aria-label="Close menu"]').click();
  await expect(page.locator("text=Services")).not.toBeVisible();
});
```

- [ ] **Step 3: Write contact form E2E test**

```typescript
// e2e/contact.spec.ts
import { test, expect } from "@playwright/test";

test("contact form submits successfully", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("h1")).toContainText("Start a conversation");

  await page.fill("#name", "Test User");
  await page.fill("#email", "test@example.com");
  await page.fill("#company", "Test Corp");
  await page.fill("#message", "This is a test inquiry from Playwright.");
  await page.click('button[type="submit"]');

  await expect(page.locator("text=Message sent")).toBeVisible({ timeout: 5000 });
});

test("contact form shows validation error", async ({ page }) => {
  await page.goto("/contact");
  await page.click('button[type="submit"]');

  // Form should not submit — stays on the form
  await expect(page.locator("text=Message sent")).not.toBeVisible();
});
```

- [ ] **Step 4: Run E2E tests**

```bash
npx playwright install --with-deps chromium
npx playwright test
```
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts e2e/
git commit -m "test: add Playwright E2E tests for homepage, auth, and contact

🤖 Generated with Claude Code"
```

---

### Task 22: Vitest unit tests

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/__tests__/contact.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write Vitest config**

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 2: Write contact validation test**

```typescript
// src/lib/__tests__/contact.test.ts
import { describe, it, expect } from "vitest";

describe("Contact validation", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it("accepts valid emails", () => {
    expect(emailRegex.test("user@company.com")).toBe(true);
    expect(emailRegex.test("a@b.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(emailRegex.test("notanemail")).toBe(false);
    expect(emailRegex.test("@nouser.com")).toBe(false);
    expect(emailRegex.test("")).toBe(false);
  });
});
```

- [ ] **Step 3: Add test script to package.json**

Ensure package.json has:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 4: Run tests**

```bash
pnpm test
```
Expected: Tests pass.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts src/lib/__tests__/ package.json
git commit -m "test: add Vitest config and contact validation tests

🤖 Generated with Claude Code"
```

---

### Task 23: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: tabula
          POSTGRES_PASSWORD: tabula
          POSTGRES_DB: tabula_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - uses: pnpm/action-setup@v2
        with:
          version: latest

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

    env:
      DATABASE_URL: postgresql://tabula:tabula@localhost:5432/tabula_test
      AUTH_SECRET: test-secret-do-not-use-in-production
```

- [ ] **Step 2: Add scripts to package.json**

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml package.json
git commit -m "ci: add GitHub Actions workflow for lint, typecheck, test, and build

🤖 Generated with Claude Code"
```

---

## Phase 10: Final Polish

### Task 24: SEO metadata, OG images, not-found page

**Files:**
- Create: `src/app/not-found.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Modify: `src/app/layout.tsx` (metadata enhancement)

- [ ] **Step 1: Create not-found page**

```tsx
// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary">
      <div className="text-center">
        <p className="font-serif text-6xl text-accent">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-text-muted">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create robots.txt**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tabula.ai/sitemap.xml",
  };
}
```

- [ ] **Step 3: Create sitemap**

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tabula.ai", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://tabula.ai/services", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://tabula.ai/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://tabula.ai/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://tabula.ai/case-studies", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://tabula.ai/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/not-found.tsx src/app/robots.ts src/app/sitemap.ts
git commit -m "feat: add SEO pages (404, robots.txt, sitemap)

🤖 Generated with Claude Code"
```

---

### Task 25: Final verification and cleanup

- [ ] **Step 1: Full build verification**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
Expected: All commands pass with no errors.

- [ ] **Step 2: Run production build locally**

```bash
pnpm build && pnpm start
```
Visit http://localhost:3000. Verify all pages work, dashboard is gated, contact form submits.

- [ ] **Step 3: Clean up old index.html**

```bash
git rm index.html
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove old index.html, final cleanup

🤖 Generated with Claude Code"
```

---

## File Summary

| File | Phase |
|------|-------|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | 1 — Scaffold |
| `tailwind.config.ts`, `src/styles/globals.css` | 1 — Design tokens |
| `src/lib/utils.ts`, `src/app/layout.tsx` | 2 — Root layout |
| `prisma/schema.prisma`, `.env`, `src/lib/prisma.ts` | 3 — Database |
| `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/middleware.ts` | 3 — Auth |
| `src/app/(marketing)/layout.tsx` | 4 — Marketing layout |
| `src/components/navbar.tsx`, `src/components/footer.tsx` | 4 — Nav/Footer |
| `src/components/mobile-nav.tsx`, `src/components/theme-toggle.tsx` | 4 — Client nav |
| `src/components/hero.tsx`, `src/components/particle-canvas.tsx` | 5 — Hero |
| `src/components/problem-section.tsx`, `src/components/scroll-reveal.tsx` | 5 — Problem |
| `src/components/process-timeline.tsx` | 5 — Process |
| `src/components/services-section.tsx` | 5 — Services |
| `src/components/cursor-card.tsx`, `src/components/use-cases-section.tsx` | 5 — Use cases |
| `src/components/animated-counter.tsx`, `src/components/social-proof-section.tsx` | 5 — Metrics |
| `src/components/cta-section.tsx` | 5 — CTA |
| `src/app/(marketing)/page.tsx` | 5 — Homepage |
| `src/app/(auth)/layout.tsx`, `src/app/(auth)/signin/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/verify/page.tsx` | 6 — Auth pages |
| `src/components/sign-in-form.tsx` | 6 — Sign-in form |
| `src/lib/actions/contact.ts`, `src/components/contact-form.tsx` | 6 — Contact |
| `src/app/(marketing)/contact/page.tsx` | 6 — Contact page |
| `src/app/(dashboard)/layout.tsx` | 7 — Dashboard layout |
| `src/components/dashboard-sidebar.tsx`, `src/components/session-provider.tsx` | 7 — Dashboard UI |
| `src/app/(dashboard)/page.tsx`, `src/app/(dashboard)/projects/page.tsx`, `src/app/(dashboard)/inquiries/page.tsx`, `src/app/(dashboard)/profile/page.tsx` | 7 — Dashboard pages |
| `src/app/(marketing)/blog/page.tsx`, `src/app/(marketing)/blog/[slug]/page.tsx` | 8 — Blog |
| `src/app/(marketing)/case-studies/page.tsx`, `src/app/(marketing)/case-studies/[slug]/page.tsx` | 8 — Case studies |
| `src/app/(marketing)/services/page.tsx`, `src/app/(marketing)/about/page.tsx` | 8 — Static pages |
| `playwright.config.ts`, `e2e/homepage.spec.ts`, `e2e/auth.spec.ts`, `e2e/contact.spec.ts` | 9 — E2E |
| `vitest.config.ts`, `src/lib/__tests__/contact.test.ts` | 9 — Unit tests |
| `.github/workflows/ci.yml` | 9 — CI |
| `src/app/not-found.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts` | 10 — SEO |

---

## Architecture Decisions Recap

1. **Server-first data fetching** — Pages are server components that query Prisma directly. No client-side REST/GraphQL calls for data reads.
2. **Server actions for mutations** — Contact form, profile updates use server actions. Progressive enhancement — forms work without JS.
3. **Client components as leaf nodes** — Only 6 client components: ParticleCanvas, MobileNav, ThemeToggle, SignInForm, CursorCard, ScrollReveal. Everything else is server-rendered.
4. **No external CMS** — Blog and case studies as DB models. Simple, zero-cost, no build-time dependency.
5. **CSS-only light/dark** — Theme toggle swaps a `dark` class on `<html>`. All color tokens defined in tailwind.config.ts. No JS framework for theming.
