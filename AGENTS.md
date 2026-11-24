# AI Agent Guidelines & Architecture Rules
**Project:** West Bengal AI Smart Bus Booking Platform (One Go Bus)  
**Target:** Sprint 0 to Sprint 5 (10-Week "Build-Then-Learn" Roadmap)

---

## 1. Strict Technology Stack (Pinned — Never Deviate)
- **Language & Runtime:** Java 25 (LTS) with virtual threads enabled.
- **Backend Framework:** Spring Boot 4.1.x using Maven Wrapper (`./mvnw` on Unix, `.\mvnw.cmd` on Windows).
- **Backend Modules:** Spring Web, Spring Validation, Spring Security (JWT), Spring Data JPA, Flyway, Spring Boot Actuator, springdoc-openapi (Swagger UI), Spring AI 2.0.x.
- **Database & Persistence:** PostgreSQL 18 with `pgvector` hosted on Neon Free Tier (external managed service with SSL enabled).
- **In-Memory Cache / Locks:** Redis on Upstash Free Tier (atomic 7-minute seat hold locks).
- **Frontend Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, TanStack Query.
- **CI/CD & Containers:** Docker, GitHub Actions (Testcontainers for integration testing on public GitHub repo).
- **Cross-Platform Support:** Use standard paths. For Windows environments, prefer Docker Compose (`docker compose up --build backend`) or PowerShell-compatible environment variable loaders.
- **Strictly Deferred (DO NOT ADD):** Kubernetes, Caffeine cache, JPA + JdbcClient split, Python FastAPI service, MapLibre/offline PWA routing engine.

---

## 2. Architectural Layering & Coding Conventions
- **Strict Layering:** `Controller -> Service -> Repository`.
  - **Controllers:** Handle HTTP validation, map DTOs, and delegate. ZERO business logic allowed in controllers.
  - **Services:** Manage transactions, enforce domain validation, hold business logic.
  - **Repositories:** Pure Spring Data JPA interfaces; standard indexed queries.
- **Data Transfer Objects (DTOs):** All request and response bodies MUST be immutable Java `record` types.
- **File Length Guideline:** Keep classes concise and modular (under ~80 lines where possible).
- **Dependency Guardrail:** Never add any Maven dependency or npm package without explicit user permission.
- **Secrets Management:** NEVER hardcode database credentials, JWT secrets, or API keys in source files. All configuration must be sourced via environment variables (`.env` locally, secrets in CI/CD).
- **Observability:** Keep Spring Boot Actuator health checks enabled, structured logging active, and Hibernate SQL logging enabled for local inspection.

---

## 3. Privacy & AI Agent Guardrails
- **Propose-Only Tools:** The Spring AI agent may search trips, explain rules, and propose seat holds. It can NEVER charge money or finalize bookings directly. Final booking/payment requires a user-confirmed REST call.
- **Data Minimization:** Never send passenger PII (names, phone numbers, email addresses) to third-party LLMs.
- **SQL / Prompt Injection Defense:** All user inputs and vector RAG chunks are treated as untrusted data.

---

## 4. One Go Bus Frontend Architecture & UI Guardrails
- **Official Brand:** **One Go Bus** (all former names — Roamly, BusWise, BusSathi, ApnaBus, VanGo Bus, OneGoBus — are strictly obsolete. Never use "VanGo Bus", "OneGoBus", or any variation).
- **Primary Entry Point:** `frontend/src/pages/HomePage.tsx` mounted at `/`. Old `OnboardingPage.tsx` is completely deprecated and deleted.
- **Universal Layout (`AppLayout.tsx`):** All application routes are wrapped inside `AppLayout`, providing:
  - Floating pill glassmorphic `Navbar` (`fixed top-3 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl z-50`).
  - Top padding `pt-20` on `<main>` ensuring **Zero Cumulative Layout Shift (CLS = 0)**.
  - Full-width natural canvas `Footer` driven by typed config (`footer.config.ts`).
- **Footer Architecture (Pixel-Accurate 4-Section System):**
  - Section 1: Dark Navy CTA Banner (`#0B2341`, rounded 26px, height ~220px, orange `MADE FOR MOVING` label, heading `Your next journey starts here.`, route illustration, `Find buses →` CTA).
  - Section 2: 5-Column Navigation Grid (Brand identity, `EXPLORE`, `COMPANY`, `SUPPORT`, `GET IN TOUCH` with Kolkata address and contact button).
  - Section 3: Newsletter Subscription (`Get route updates`, email input, navy `Subscribe` button, interactive validation).
  - Section 4: Bottom Legal Bar (Dynamic year copyright, centered legal links, delicate Kolkata skyline vector illustration depicting Victoria Memorial & Howrah Bridge, and `Made for West Bengal` with orange heart).
- **Glassmorphic System (@utility glass):**
  - Reusable CSS utility defined via Tailwind v4 `@utility glass` in `frontend/src/index.css`.
  - Configurable CSS variables: `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`, `--glass-highlight`, `--glass-fallback-bg`.
  - Strict Light Mode Architecture: Dark mode is deferred. The application uses the light mode palette exclusively (`--canvas: #FBF9F5`, `--brand: #0B2341`, `--accent: #A04100`, `--accent-bright: #FC7728`, `--ink-strong: #000D21`, `--ink-muted: #44474E`).
  - Passive scroll state toggling via `data-scrolled="true"` on the DOM node (zero React re-renders).
- **Performance & Code Splitting:**
  - All page routes MUST be lazy-loaded using `React.lazy()` and `Suspense`.
  - No heavy icon fonts or animation libraries — strictly inline SVGs and tree-shaken `lucide-react` icons.
- **Profile Page Architecture (Phase 27 & 28 Kolkata Heritage Panorama & Milestones):**
  - **Banner Surface:** Minimalist, uncluttered rounded card (`rounded-3xl border border-[#EAE8E4] bg-[#FCEBD7] shadow-sm`) incorporating the authentic 1552x236 Kolkata heritage illustration (`kolkata-profile-banner.webp`).
  - **Hero Banner Identity:** Clean presentation containing only user avatar (with camera badge), name ("Soumabha Majumder"), emerald "Verified Traveler" badge, and a high-contrast frosted glass contact capsule (`bg-white/85 backdrop-blur-md`) for email and phone. Sign Out button is cleanly pinned to the top-right. Over 70% of the banner remains completely clear to showcase Victoria Memorial, River Ganges, Howrah Bridge, and the vintage Kolkata bus without text collisions.
  - **Traveler Milestones Strip:** Dedicated 4-card quick perks bar below the banner: `Member Since` (tenure), `Completed Trips` (count), `OneGo AI Savings` (rupee savings), and `Favorite Corridor` (frequent route). Responsive 4-column layout on desktop, 2x2 grid on mobile.
  - **Mobile Layout:** Dedicated top scenic illustration window (`h-36 object-cover object-right`) with the Sign Out button pinned at the top-right. Avatar overlaps cleanly (`-mt-12`) with user details and contact capsule stacked below.
  - **Information Architecture:** 3 interactive tabs (`Personal Information`, `Travel Preferences`, `Security & Sessions`) with full reactive updates and zero layout shift.
  - **Universal Backend-Synced Sign Out Flow & Premium Modal (Phases 29, 32 & 33):** All sign-out touchpoints across the entire application—including the desktop banner button, Security tab danger zone, floating pill Navbar profile dropdown menu, and mobile drawer (`MobileMenu.tsx`)—open the dedicated confirmation modal (`SignOutModal.tsx`) with dimmed backdrop, spring pop-in transition, zero-shift scroll lock, and ESC-key dismiss. Dialog features a warm cream header with Kolkata heritage artwork (`kolkata-profile-banner.webp`), Howrah Bridge and vintage bus, live `One Go Bus` brand badge, top-right circular close button, max width 480px with 16px mobile margins, initial keyboard focus on "Stay signed in", opener focus restoration on dismissal, and disabled state while pending. Confirming initiates an asynchronous `POST /api/v1/auth/logout` call to Spring Boot (clearing HTTP-only cookies) prior to clearing localStorage session credentials and routing to `/`.
