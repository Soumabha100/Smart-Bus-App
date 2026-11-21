# One Go Bus — Technical Documentation & Architecture Reference (Docs.md)

> **Repository:** West Bengal AI Smart Bus Booking Platform (One Go Bus)  
> **Active Branch:** `feature/onego-theme-auth-ui`  
> **Last Updated:** November 2026 (Phase 24)

---

## 1. Brand Identity & Strict Design System

### Official Brand Name
- **Official Brand:** **One Go Bus**
- Strict Rule: Never use "VanGo Bus", "OneGoBus", or any variation. Always write "One Go Bus" with spaces ("One Go" in Navy `#0B2341`, "Bus" in Orange `#FC7728`).

### Color Palette (from `frontend/src/index.css`)
| Role | Hex Code | Token |
| :--- | :--- | :--- |
| Primary Navy | `#0B2341` | `--brand` / `--brand-navy` |
| Dark Navy | `#000D21` | `--ink-strong` / `--brand-hover` |
| Brand Orange | `#FC7728` | `--accent-bright` / `--brand-orange` |
| Deep Accent Orange | `#A04100` | `--accent` |
| Main Page Canvas | `#FBF9F5` | `--canvas` |
| Footer Surface | `#FFFFFF` | `--surface` |
| Soft Neutral Surface | `#F5F3EF` | `--surface-2` |
| Thin Border / Divider | `#EAE8E4` | Border token |
| Main Typography Ink | `#1B1C1A` | `--ink` |
| Secondary Typography Ink | `#44474E` | `--ink-muted` |

---

## 2. Rebuilt Premium Footer Specification (Phase 24)

The website footer has been completely redesigned to match the pixel-accurate reference design (`media_1795202553622_7da2d823.jpg`). It contains 4 distinct, cohesive sections:

### Section 1: Premium Dark Navy CTA Banner
- **Container:** Rounded `rounded-[26px]` container with `#0B2341` background, padding `px-6 sm:px-12 lg:px-16 py-8 sm:py-10`.
- **Left Content:**
  - Small uppercase orange tag: `MADE FOR MOVING` (`#FC7728`).
  - Heading: `Your next journey starts here.` (White, ExtraBold, ~46px desktop).
  - Supporting text: `Explore routes across Kolkata and West Bengal.` (White/85, ~22px desktop).
- **Right Content:**
  - Minimalist transit route illustration with location pin, smooth curved white path, orange waypoint node (`#FC7728`), and white front-facing bus icon.
  - Main CTA button: `Find buses →` (White background, `#0B2341` navy text, `rounded-[22px]`, hover slide animation).

### Section 2: 5-Column Navigation & Brand Grid
- **Column 1 — Brand Identity (~28%):**
  - Navy rounded-square bus emblem (`#0B2341`) with white front-facing bus and orange visor.
  - Wordmark: `One Go ` (Navy) `Bus` (Orange).
  - Mission statement: *"A simpler way to discover routes, choose seats and travel across West Bengal."*
  - 3 Square Social Buttons: Instagram, LinkedIn, GitHub (`#F5F3EF`, radius 12px, monochrome icons using high-contrast filled `fill="currentColor"` glyphs).
- **Column 2 — EXPLORE (~15%):**
  - Links: `Search Buses`, `Popular Routes`, `Live Tracking`, `Ask AI`.
- **Column 3 — COMPANY (~15%):**
  - Links: `About Us`, `Our Team`, `How It Works`.
- **Column 4 — SUPPORT (~18%):**
  - Links: `Help Center`, `FAQs`, `Cancellations & Refunds`, `Contact Support`.
- **Column 5 — GET IN TOUCH (~22%):**
  - Location: Orange pin with `Kolkata, West Bengal, India`.
  - Outlined button: `Contact our team` with envelope icon linking to `/contact`.

### Section 3: Newsletter Subscription
- Enclosed within thin `#EAE8E4` dividers.
- Left side: Orange envelope icon + `Get route updates` + *"Occasional travel news, straight to your inbox."*
- Right side: Responsive email input (`Email address`) and navy `#0B2341` `Subscribe` button.
- Interactive email validation and success toast alert.

### Section 4: Bottom Footer Bar & Kolkata Landmark Line-Art
- Thin `#EAE8E4` top divider.
- Left: `© {currentYear} One Go Bus. All rights reserved.`
- Center: `Privacy Policy` • `Terms of Service` • `Accessibility`.
- Center-Right: Authentic delicate vector line-art depicting the **Victoria Memorial dome** and **Howrah Bridge cantilever truss**.
- Far-Right: Orange outlined heart icon + `Made for West Bengal` in semibold navy.

---

## 3. User Authentication & Profile Flow (Phase 23)

- **Reactive State (`AuthContext` & `useAuth`):** Decoupled context definition (`authContextInstance.ts`), provider component (`AuthContext.tsx`), and hook (`useAuth.ts`) to satisfy Vite Fast Refresh.
- **Top Navbar Profile Dropdown:** Replaces "Sign In" and "Register" buttons with a circular 40px avatar with online status indicator. The dropdown menu uses a 98% opaque frosted glass surface (`bg-white/98 backdrop-blur-2xl`) with multi-layered drop shadows, branded user header card, structured icon wells, title/subtitle metadata, and subtle chevron indicators to guarantee complete contrast even over busy hero graphics. Options: `My Profile`, `My Bookings / Trips`, `Preferences & Settings`, and `Sign Out`.
- **Profile Page (`/profile`):** Protected route displaying personal details (editable), bus seat preferences, DPDP 2025 compliance statement with JSON data export, and security sessions.

---

## 4. Verification & Quality Gates
- **Build Verification:** `npm --prefix frontend run build` compiles in ~290ms across 26 chunks with 0 errors.
- **Lint Verification:** `npm --prefix frontend run lint` passes with 0 errors and 0 warnings.
