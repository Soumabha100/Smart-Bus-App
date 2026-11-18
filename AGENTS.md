# AI Agent Guidelines & Architecture Rules
**Project:** West Bengal AI Smart Bus Booking Platform  
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

## 3. DPDP 2025 Privacy & AI Agent Guardrails
- **Propose-Only Tools:** The Spring AI agent may search trips, explain rules, and propose seat holds. It can NEVER charge money or finalize bookings directly. Final booking/payment requires a user-confirmed REST call.
- **Data Minimization (DPDP Rules 2025):** Never send passenger PII (names, phone numbers, email addresses) to third-party LLMs.
- **SQL / Prompt Injection Defense:** All user inputs and vector RAG chunks are treated as untrusted data.

---

## 4. OneGoBus Frontend Architecture & UI Guardrails
- **Official Brand:** **OneGoBus** (all former names — Roamly, BusWise, BusSathi, ApnaBus — are strictly obsolete).
- **Primary Entry Point:** `frontend/src/pages/HomePage.tsx` mounted at `/`. Old `OnboardingPage.tsx` is completely deprecated and deleted.
- **Universal Layout (`AppLayout.tsx`):** All application routes are wrapped inside `AppLayout`, providing:
  - Floating pill glassmorphic `Navbar` (`fixed top-3 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl z-50`).
  - Top padding `pt-20` on `<main>` ensuring **Zero Cumulative Layout Shift (CLS = 0)**.
  - Multi-column responsive glass `Footer` driven by typed config (`footer.config.ts`).
- **Glassmorphic System (@utility glass):**
  - Reusable CSS utility defined via Tailwind v4 `@utility glass` in `frontend/src/index.css`.
  - Configurable CSS variables: `--glass-bg`, `--glass-border`, `--glass-blur`, `--glass-shadow`, `--glass-highlight`, `--glass-fallback-bg`.
  - Strict Light Mode Architecture: Dark mode is deferred. The application uses the light mode palette exclusively (`--canvas: #FBF9F5`, `--brand: #0B2341`, `--accent: #A04100`, `--accent-bright: #FC7728`, `--ink-strong: #000D21`, `--ink-muted: #44474E`).
  - Passive scroll state toggling via `data-scrolled="true"` on the DOM node (zero React re-renders).
- **Performance & Code Splitting:**
  - All page routes MUST be lazy-loaded using `React.lazy()` and `Suspense`.
  - No heavy icon fonts or animation libraries — strictly inline SVGs and tree-shaken `lucide-react` icons.
