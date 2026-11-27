# One Go Bus — Technical Documentation & Architecture Reference (Docs.md)

> **Repository:** West Bengal AI Smart Bus Booking Platform (One Go Bus)  
> **Active Branch:** `feature/onego-theme-auth-ui`  
> **Last Updated:** November 2026 (Phase 37)

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
- **Profile Page (`/profile` — Phase 27, 28 & 34 Redesign):**
  - **Heritage Panoramic Banner:** Integrated high-resolution 8000x2664 (3:1) WebP artwork (`kolkata-profile-banner.webp`) in an aspect-matched right-anchored `aspect-[3/1]` desktop frame (`sm:min-h-[208px] lg:min-h-[228px]`, `#FEE6D3` surface) representing Kolkata culture (Victoria Memorial, Ganges riverboat, Howrah Bridge cantilever, iconic yellow/blue bus, overhanging orange blossoms, and vintage lamppost) with zero vertical cropping.
  - **Minimalist Hero Identity:** Minimal, high-contrast presentation containing avatar with camera badge, user name ("Soumabha Majumder"), emerald "Verified Traveler" pill, and a frosted glass contact capsule (`bg-white/85 backdrop-blur-md`) with email and phone. Over 65% of the artwork remains completely clear and unobstructed.
  - **Traveler Milestones & Perks Strip:** Dedicated 4-card metric strip directly below the banner displaying `Member Since` (tenure), `Completed Trips`, `OneGo AI Savings`, and `Favorite Corridor` with dedicated colored icon micro-containers and bold ink typography (4-column desktop, 2x2 mobile grid).
  - **Smooth Gradient Seam & Performance Pre-Decoding:** Seamless `#FEE6D3` left-edge feather mask, explicit `width={8000} height={2664}`, `fetchPriority="high"`, `decoding="async"`, and cached `img.decode()` pre-warming via `preloadKolkataBanner.ts`.
  - **Mobile Stacking:** Dedicated `aspect-[12/5]` (`min-h-[148px] max-h-[176px]`) scenic window on top with top-right Sign Out button, overlapping centered avatar (`-mt-12`), and cleanly stacked details with zero text collision over the artwork.
  - **Tabs & Interactive Functionality:** 3 functional tabs (`Personal Information`, `Travel Preferences`, `Security & Sessions`) with live form saving, preference toggling, and active session monitoring.
- **Backend-Synchronized Sign Out Flow & Modal (Phases 29, 32, 33 & 34):**
  - **Spring Boot Backend Endpoint:** Implemented `@PostMapping("/logout")` in `AuthController.java` expiring HTTP-only session cookies (`onego_token`, maxAge=0).
  - **Asynchronous Frontend Dispatch:** Added `logoutUser()` in `frontend/src/api/authApi.ts` invoked asynchronously inside `AuthContext.tsx` before local token purging.
  - **Sign Out Confirmation Modal (`SignOutModal.tsx`):** Code-split (`React.lazy`) pixel-accurate dialog pre-warmed on idle/hover when authenticated, featuring dimmed backdrop (`bg-[#000D21]/60 backdrop-blur-xs`), GPU-composited pop-in animation (`zoom-in-95 ease-out transform-gpu`), warm cream `#FEE6D3` 3:1 Kolkata heritage header (`h-[148px] sm:h-[164px]`) with left brand legibility feather, circular close button, max-width 480px with 16px mobile margins, initial keyboard focus on "Stay signed in", ESC-key dismiss with focus restoration to opener, and deep navy `#0B2341` primary action disabled while request is pending. Universally connected across Profile banner, Profile Security tab, Navbar profile dropdown, and Mobile menu drawer.

---

## 4. Redesigned Search Results Page (`/results` — Phase 35)

- **URL & State Synchronization (`ResultsPage.tsx`, `HomePage.tsx`, `journeyDate.ts`):**
  - Supports validated `from`, `to`, and Asia/Kolkata `YYYY-MM-DD` `date` query parameters (plus optional `passengers`, `coach`, `maxPrice`, `time`) with `location.state` fallback so refresh, shared links, `history.back()` / `history.forward()`, and `Edit search` prefilling restore the exact search without `toISOString()` local-midnight drift.
- **Editorial Header, Bengal Panorama & Date Strip (`RouteIllustration.tsx`, `DateStrip.tsx`):**
  - Compact route header (`sm:min-h-[120px] lg:min-h-[128px]`, `#FEFDF7` warm-white surface) with single `h1`, Asia/Kolkata formatted date, optional passenger/coach count only when known, permanent full-bleed right-anchored panoramic artwork (`Results-Page-Banner.webp`, `4000x1332` `3:1`, Howrah Bridge -> North Bengal tea gardens & coach) rendered across **all** routes and destinations with seamless `#FEFDF7` feathering, crisp mobile top scenic window (`aspect-[3/1]`), and frosted `Edit search` button.
  - Scrollable `DateStrip` (`68-80px` desktop) generating nearby days dynamically from today's live `Asia/Kolkata` date across a rolling 90-day booking window (`getBookingWindowStart()` to `getBookingWindowEnd()`), automatically rolling forward on date change/midnight, displaying each day's derived lowest starting fare (`₹`), `No buses` on confirmed empty days, solid navy `#0B2341` selection fill, prev/next chevrons, and accessible calendar picker popover.
- **Grid, Filters & Perforated Ticket Cards (`FilterSidebar.tsx`, `TicketCard.tsx`, `inventory.ts`, `index.css` — Phase 36):**
  - Desktop two-column grid (`lg:grid-cols-[264px_minmax(0,1fr)] gap-6`) showing two complete bus cards and their tangerine `View seats →` (`#FF883E` bg, bold `#0B2341` text) CTAs above the fold at `1440×900`.
  - Perforated `78% / 22%` ticket layout (`rounded-2xl`): white main section with thin horizontal footer divider ending at the vertical dashed seam, pure CSS semicircular top/bottom cutouts (`clip-path`) matching `--canvas`, alternating odd `#FFF5EB` peach and even `#EEF5FD` blue fare stubs + initials badges (`SP`, `GT`, etc.).
  - Deduplicated footer amenities (hiding `AC` / `Sleeper` / `Seater` when already displayed in `coachTypeLabel`), compact `Wi-Fi`, `Charging`, `Water`, optional missing rating guard, `Bus details ›` expandable panel, and responsive `< 768px` mobile horizontal dashed seam with left/right cutouts.
  - Optimized for large inventories using `React.memo(TicketCard)`, `useCallback` handlers, and CSS `content-visibility: auto` (`.ticket-perf-item`).
  - Mobile `< lg` Filters drawer sheet with active filter badge, Escape/close focus return, and `Show N buses` apply button.
  - Canonical `coachTypeId` (`ac-sleeper` vs `ac-seater`), canonical `OPERATOR_GROUPS` matching, working `amenities` filtering, numeric `parseDurationMinutes()` sorting for `Fastest`, and dynamic schedule-derived `+1 day` arrival offsets.
  - Stale-request safe `fetchDeparturesForSearch`, loading/retry and empty-date states, and honest `Seats selected` handoff preserving `journeyDateDisplay` through `SeatSelectionModal` and `SeatHoldModal` without unsubstantiated promises or fictional held seats.

---

## 5. Verification & Quality Gates
- **Build Verification:** `npm --prefix frontend run build` compiles cleanly with 0 errors across 27 code-split chunks (including lazy `SignOutModal` chunk).
- **Lint Verification:** `npm --prefix frontend run lint` passes with 0 errors and 0 warnings.
