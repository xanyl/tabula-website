# Tabula Website — Complete Redesign Spec

**Date:** 2026-05-25  
**Status:** Approved  
**Scope:** Full rebuild of tabula-website from single HTML file to production Next.js application

---

## 1. Overview

Tabula is a consulting company that transforms manual business workflows into AI-powered automated systems. The current site is a single `index.html` (970 lines) with inline CSS and minimal JS. This spec covers a ground-up rebuild as a full-stack Next.js application with user accounts, a functional contact system, and a creative, award-contending visual design.

### Core Principle

The website itself is Tabula's first case study. It must feel like what Tabula sells: **clarity carved from complexity, intelligence made visible, friction dissolved.**

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 (App Router) | Server components, server actions, built-in API routes, SEO |
| Language | TypeScript (strict) | Type safety end-to-end |
| Styling | Tailwind CSS 4 | Utility-first, design tokens as Tailwind config |
| Animation | Framer Motion | Spring physics, scroll-driven animations, layout transitions |
| Auth | NextAuth.js v5 (Auth.js) | Multi-provider, session-based, middleware-native |
| Database | PostgreSQL + Prisma ORM | Type-safe queries, migrations, relational data |
| Email | Resend | Transactional email (magic link, contact notifications) |
| Deployment | Vercel | Native Next.js support, edge functions, analytics |
| Package Manager | pnpm | Fast, disk-efficient |

---

## 3. Site Architecture

### 3.1 Route Groups

```
src/app/
├── (marketing)/           # Public — navbar + footer layout
│   ├── page.tsx            # Homepage
│   ├── services/page.tsx   # Services detail
│   ├── about/page.tsx      # About Tabula
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/page.tsx # Blog post
│   ├── case-studies/
│   │   ├── page.tsx        # Case study listing
│   │   └── [slug]/page.tsx # Case study
│   ├── contact/page.tsx    # Contact form
│   └── layout.tsx
├── (auth)/                # Minimal layout — centered card
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── verify/page.tsx
│   └── layout.tsx
├── (dashboard)/           # Protected — sidebar layout
│   ├── page.tsx            # Overview
│   ├── profile/page.tsx    # Account settings
│   ├── inquiries/page.tsx  # Contact history
│   ├── projects/page.tsx   # Project tracking
│   └── layout.tsx
├── api/
│   └── auth/[...nextauth]/ # NextAuth.js route
└── layout.tsx             # Root layout (providers, fonts)
```

### 3.2 Middleware

```typescript
// middleware.ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
```

- `/dashboard/*` → redirect to `/auth/signin` if no session
- `/auth/*` → redirect to `/dashboard` if session exists
- Everything else → public

### 3.3 Shared Components

| Component | Type | Purpose |
|-----------|------|---------|
| `Navbar` | Server | Sticky nav, auth-aware CTA |
| `Footer` | Server | Navigation, tagline, theme toggle |
| `MobileNav` | Client | Slide-out drawer, focus trap |
| `ContactForm` | Client | Validated form, server action submit |
| `ThemeToggle` | Client | Dark/light/system, persisted to cookie |
| `ServiceCard` | Server | Reusable card for services |
| `ProcessStep` | Server | Numbered step in process |
| `BlogCard` | Server | Post preview |
| `CaseStudyCard` | Server | Case study preview |
| `DashboardSidebar` | Client | Collapsible sidebar, active link |

---

## 4. Visual Design System

### 4.1 Design Language: "Intelligence Emerging from Chaos"

The visual metaphor: scattered elements coalesce into structured clarity as the user scrolls. The site manifests the Tabula promise — turning chaos into order.

### 4.2 Color System

**Monochrome core + single accent.** Like Stripe, Linear, Better Stack.

| Token | Value | Usage |
|-------|-------|-------|
| `bg-primary` | `#09090B` | Deepest background |
| `bg-surface` | `#131316` | Cards, panels |
| `bg-elevated` | `#1A1A1F` | Hovered cards, modals |
| `text-primary` | `#FAFAFA` | Body text |
| `text-muted` | `#A1A1AA` | Secondary text |
| `accent` | `#6366F1` (Indigo 500) | Primary CTAs, links, highlights |

Dark mode is default. Light mode uses the same token structure with inverted values (`#FAFAFA` background, `#09090B` text).

### 4.3 Typography

- **Inter** — Body, navigation, UI, cards. Clean, neutral, highly readable.
- **Instrument Serif** — Hero headlines, pull-quotes, metric numbers. Adds warmth and authority.
- Rationale: Serif = "we think deeply." Sans = "we execute precisely."

### 4.4 Spacing

4px base grid. Section padding: 120px top/bottom. Content max-width: 1200px (marketing), 1400px (dashboard). Hero fills viewport (90vh min).

### 4.5 Creative Techniques

1. **Canvas Particle Hero** — Particles scattered chaotically, coalesce into the Tabula "T" mark on scroll. Cursor-reactive (particles gently repelled). Rendered via Canvas + requestAnimationFrame.
2. **Before/After Dissolve** — Split screen showing chaotic manual processes (left) vs structured automated systems (right). On scroll, chaotic elements visibly dissolve and reorganize into the structured side.
3. **Animated Process Timeline** — Vertical SVG path draws itself between four steps as the user scrolls. Active step dot pulses with glow. Step numbers count up with spring animation.
4. **Asymmetric Bento Grid** — Services rendered in cards of varying sizes. AI Audit (flagship service) spans 2 rows and 1.5 columns. Layout hierarchy communicates content priority.
5. **Cursor-Tracking Cards** — Service/use-case cards have a 3D perspective tilt that follows the cursor, plus a dynamic radial gradient that shifts with mouse position. CSS custom properties (`--mx`, `--my`) updated via mousemove.
6. **Spring-Animated Metrics** — Large numbers (60%, 3x, 100%) count up from zero using Framer Motion `useSpring`. Rendered in Instrument Serif at 5rem+. No bounding boxes — numbers float in space.
7. **Marquee Trust Strip** — Auto-scrolling horizontal strip of key value props. Subtle motion that builds credibility.
8. **Section Color Transitions** — Background dissolves from dark zinc to deep indigo for the CTA section. Color shift signals "entering Tabula's world."
9. **Dot Grid + Grain Overlay** — Subtle CSS background textures for depth. Film-like quality.

### 4.6 Motion Language

| Element | Animation | Tech |
|---------|-----------|------|
| Hero particles | Chaos → order, cursor-reactive | Canvas + rAF |
| Sections on scroll | Staggered fade-up, 400ms spring | Framer Motion `useInView` |
| Buttons | Scale 0.98 on press, translateY(-1px) hover | Tailwind transition |
| Cards | 3D tilt + gradient follows cursor | CSS custom properties + mousemove |
| Metrics | Count-up with spring physics | Framer Motion `useSpring` |
| Process timeline | SVG path draw + dot pulse | Framer Motion + IntersectionObserver |
| Theme toggle | Smooth color dissolve (300ms) | CSS transition on `:root` vars |
| Page transitions | Crossfade (200ms) | Framer Motion `AnimatePresence` |

---

## 5. Database Schema

### 5.1 Models

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  inquiries     ContactInquiry[]
  projects      Project[]
  posts         BlogPost[]
  caseStudies   CaseStudy[]
}

model ContactInquiry {
  id        String    @id @default(cuid())
  name      String
  email     String
  company   String?
  message   String
  status    InquiryStatus @default(NEW)
  createdAt DateTime  @default(now())
  userId    String?
  user      User?     @relation(fields: [userId], references: [id])
}

enum InquiryStatus {
  NEW
  IN_REVIEW
  RESPONDED
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      ProjectStatus @default(DISCOVERY)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

enum ProjectStatus {
  DISCOVERY
  DESIGN
  BUILD
  REFINE
  COMPLETE
}

model BlogPost {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String
  content     String    // Markdown
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
  content     String    // Markdown
  metrics     Json      // {"time saved": "60%", "cost reduction": "$200K/yr"}
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  authorId    String?
  author      User?     @relation(fields: [authorId], references: [id])
}
```

### 5.2 Key Design Decisions

- `ContactInquiry.userId` is nullable — public visitors can submit without an account
- `CaseStudy.metrics` as JSON — flexible key-value pairs without a separate table
- Blog and case studies as DB models (no headless CMS) — zero external dependencies
- No admin UI at this stage — content managed via DB or MDX files

### 5.3 Indexes

- `BlogPost.slug` — unique (URL lookup)
- `CaseStudy.slug` — unique
- `ContactInquiry.email` — non-unique (search/dedup)
- `ContactInquiry.status` — non-unique (dashboard filter)
- `Project.userId` — non-unique (user's project list)
- `User.email` — unique (auth lookup)

---

## 6. Auth Flow

### 6.1 Providers

- Google OAuth
- GitHub OAuth
- Email magic link (Resend)

### 6.2 Flow

1. User visits `/auth/signin`
2. Clicks provider → OAuth redirect → callback verifies token → upserts User → JWT session set → redirect to `/dashboard`
3. Or enters email → magic link sent via Resend → click link → verified → same session creation

### 6.3 Session Availability

- **Server Components:** `const session = await auth()` — available everywhere
- **Client Components:** `<SessionProvider>` wraps dashboard layout only (not marketing pages)
- **Navbar:** Reads session server-side, conditionally renders "Sign in" or "Dashboard" link

---

## 7. Data Flow

- **Public pages:** Server components render directly from Prisma. No client-side fetching.
- **Mutations:** Contact form, profile updates → server actions. Progressive enhancement — works without JS.
- **Dashboard data:** Server components fetch project status, inquiry history. Only interactive leaf nodes (dropdowns, modals) are client components.
- **Auth state:** Middleware protects routes. Session available in server components via `auth()`.

---

## 8. Homepage Scroll Narrative

| Section | Height | Content |
|---------|--------|---------|
| 1. Hero | 100vh | Particles coalesce into Tabula mark. One headline. One CTA. |
| 2. The Problem | 80vh | Split screen: Before (chaotic) / After (structured). Shown, not told. |
| 3. How It Works | auto | 4-step animated timeline with connecting SVG path. |
| 4. Services | auto | Asymmetric bento grid. AI Audit = hero slot. |
| 5. Use Cases | auto | Cursor-tracking cards with dynamic gradient. |
| 6. Social Proof | auto | Spring-animated metrics + marquee trust strip. |
| 7. CTA | 80vh | Background dissolves to indigo. Email input + submit. |
| 8. Footer | auto | Navigation, tagline, theme toggle. |

---

## 9. Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Utility functions, validation logic |
| Component | Vitest + Testing Library | Form behavior, auth states, empty/error states |
| E2E | Playwright | Critical paths: sign-in, contact form submission, dashboard navigation |
| Visual | Playwright screenshots | Visual regression on key pages |
| Accessibility | axe-core + Playwright | WCAG 2.1 AA compliance on all pages |

---

## 10. Deployment

- **Platform:** Vercel
- **Database:** Vercel Postgres or Supabase (PostgreSQL)
- **Env vars:** `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `RESEND_API_KEY`, `CONTACT_EMAIL`
- **CI:** GitHub Actions — lint, typecheck, test, build on PR; deploy on merge to main

---

## 11. Out of Scope (for this phase)

- Admin CMS/UI for blog and case study management
- Stripe/payment integration
- Real-time collaboration features
- Multi-tenancy
- Advanced analytics dashboard
- A/B testing infrastructure
