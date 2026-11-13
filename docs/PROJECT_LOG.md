# Roamly Project Log

## Phase 0 - Discover (2026-11-13)
- **Files Read & Audited**:
  - `AGENTS.md`, `README.md`, `docs/PROJECT_LOG.md`
  - `backend/pom.xml`, `backend/src/main/java/com/smartbus/config/SecurityConfig.java`, `backend/src/main/resources/application.yml`
  - `docker-compose.yml`, `.github/workflows/ci.yml`
  - `frontend/package.json`, `frontend/src/api/systemApi.ts`
- **Design Source Audited**:
  - `docs/design/stitch/01-onboarding.html`
  - `docs/design/stitch/02-login.html`
  - `docs/design/stitch/03-register.html`
  - `docs/design/stitch/04-home.html`
  - `docs/design/stitch/05-results.html`
- **Decisions & Alignments**:
  - Discovered 5 core pages from Stitch project `14492966675348031117` and mapped them to routes (`/`, `/login`, `/register`, `/home`, `/results`).
  - Extracted comprehensive design tokens for colors, typography (`Sora`, `Inter`), spacing, border radius (24px and pills), shadows, and CSS/SVG animations.
  - Planned shared UI components (`<JourneyLine />`, `<PillButton />`, `<GlassCard />`, `<Input />`, `<Chip />`, `<BottomBar />`, `<PerforatedTicket />`, `<ProtectedRoute />`).
  - Identified backend auth scope (`POST /api/auth/register`, `POST /api/auth/login`) with Flyway `V2__create_users.sql` and mock data scope for search & results.
- **Risks & Mitigation**:
  - Dependency guardrail from `AGENTS.md`: explicit permission required for npm/maven packages.
  - CI pipeline compatibility: `.github/workflows/ci.yml` checks React 19 build; keeping frontend compatible with React 19 ensures CI remains green.

## Phase 1 - Frontend Foundation (2026-11-13)
- **Files Changed**:
  - `frontend/package.json`, `frontend/package-lock.json`: Added `react-router-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, and `axios`.
  - `frontend/index.html`: Loaded Google Fonts (`Sora:wght@400;500;600;700`, `Inter:wght@400;500;600;700`) and Material Symbols Outlined.
  - `frontend/tailwind.config.js`: Defined complete design token dictionary (`midnight`, `cream`, `coral`, `teal`, time themes, font families, radius 24px, pill, tap targets).
  - `frontend/src/index.css`: Linked `@theme` tokens, glassmorphism utilities, perforated ticket styles, reduced-motion accessibility media queries.
  - `frontend/src/hooks/useTimeTheme.ts`: Implemented dynamic time-of-day theme hook supporting morning (peach/gold), evening (violet/deep blue), and night (midnight navy/teal).
  - `frontend/src/components/ui/JourneyLine.tsx`: Handcrafted glowing SVG route component with scenic tea hill backdrops, waypoint beads, and bus silhouette.
  - `frontend/src/components/ui/PillButton.tsx`: Reusable capsule CTA with pulse indicator, hover flare, and min 48px tap target.
  - `frontend/src/components/ui/GlassCard.tsx`: Translucent container with 24px radius, backdrop blur, and glow variants.
  - `frontend/src/components/ui/Input.tsx`: Accessible input with React Hook Form `forwardRef`, leading icons, and password show/hide eye toggle.
  - `frontend/src/components/ui/Chip.tsx`: Interactive mood and date selector chips.
  - `frontend/src/components/ui/BottomBar.tsx`: Floating bottom navigation with elevated center "Go" button.
  - `frontend/src/components/ui/PerforatedTicket.tsx`: Rounded ticket stub with dual edge cutouts, tear perforation, comfort tags, and dynamic "Best for you" glow badge.
  - `frontend/src/components/ui/index.ts`: Central export hub for UI components.
- **Decisions & Why**:
  - Configured tokens in both `tailwind.config.js` and `@theme` in `index.css` to ensure full interoperability across Tailwind v4 build tooling.
  - Implemented `PerforatedTicket` using physical circular cutout notches (`-ml-3` and `-mr-3`) combined with dashed border styling for guaranteed cross-browser consistency without clipping box-shadows.

## Phase 2 - Routing Skeleton (2026-11-13)
- **Files Changed**:
  - `frontend/src/utils/tokenStorage.ts`: Created JWT and session state storage manager with typed retrieval.
  - `frontend/src/components/auth/ProtectedRoute.tsx`: Built auth guard that routes unauthorized travelers to `/login` preserving origin intent.
  - `frontend/src/pages/OnboardingPage.tsx`: Initialized route `/`.
  - `frontend/src/pages/LoginPage.tsx`: Initialized route `/login`.
  - `frontend/src/pages/RegisterPage.tsx`: Initialized route `/register`.
  - `frontend/src/pages/HomePage.tsx`: Initialized protected route `/home`.
  - `frontend/src/pages/ResultsPage.tsx`: Initialized protected route `/results`.
  - `frontend/src/pages/NotFoundPage.tsx`: Initialized 404 handler for unmatched routes.
  - `frontend/src/pages/SystemStatusPage.tsx`: Preserved Sprint 0 walking skeleton health check at `/system-status`.
  - `frontend/src/pages/index.ts`: Central barrel exports for all page views.
  - `frontend/src/App.tsx`: Wired `BrowserRouter`, `Routes`, and route guards.

## Phase 3 - Screens 1 & 2 High-Fidelity Conversion (2026-11-13)
- **Files Changed**:
  - `frontend/src/pages/OnboardingPage.tsx`: High-fidelity Onboarding screen faithful to `01-onboarding.html`.
  - `frontend/src/pages/LoginPage.tsx`: Complete Traveler Login screen matching `02-login.html`.

## Phase 4 - Screen 3: Progressive Form with RHF & Zod (2026-11-13)
- **Files Changed**:
  - `frontend/src/schemas/authSchema.ts`: Created validation schemas for registration and login.
  - `frontend/src/pages/RegisterPage.tsx`: Built interactive 3-step progressive account creation interface.

## Desktop-First Responsive Transformation (2026-11-13)
- **Files Changed**:
  - `frontend/src/components/layout/Navbar.tsx`: Created a sticky, full-width desktop navigation bar with brand emblem, route navigation links (`Explore Routes`, `Find Buses`, `System Health`), traveler profile with initials badge, and authentication action buttons.
  - `frontend/src/components/ui/BottomBar.tsx`: Configured with `md:hidden` so that the mobile floating capsule navigation bar is hidden on tablet and desktop viewports, appearing only on mobile (<768px).
  - `frontend/src/pages/HomePage.tsx`:
    - Replaced narrow mobile wrapper with responsive `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
    - Transformed "Plan your line" into a wide horizontal booking control card: Origin circle card (KOL / Kolkata), JourneyLine connector with swap button, Destination circle card (DAR / Darjeeling), date selector chips, travel mood chips, and primary "Find Buses" button.
    - Converted "Journeys people love" into a multi-column desktop grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
  - `frontend/src/pages/ResultsPage.tsx`:
    - Integrated `<Navbar />` and structured into a desktop 2-column layout (sidebar filters + results timeline feed).
    - Added sorting (recommended, price low to high, rating, earliest departure) and live mood filtering.
    - Added seat reservation confirmation modal with DPDP compliance details.
  - `frontend/src/components/ui/PerforatedTicket.tsx`:
    - Re-engineered into a physical boarding pass on desktop: horizontal layout (`md:flex`) with main ticket details on the left, vertical dashed perforation with top/bottom circular cutouts, and a dedicated stub on the right containing fare, seat availability dots, and reserve seat action.
  - `frontend/src/pages/OnboardingPage.tsx`:
    - Transformed into a majestic 12-column desktop hero layout (Left: brand story, typography, mosaic feature cards, CTAs; Right: scenic mountain landscape with glowing SVG Journey Line, hilltop bus marker, and live trail badge).
  - `frontend/src/pages/LoginPage.tsx` & `frontend/src/pages/RegisterPage.tsx`:
    - Transformed into balanced 2-column desktop layouts (`max-w-7xl mx-auto`, 12-column grid) with visual context on the left and form cards on the right.
- **Decisions & Why**:
  - Leveraged available desktop canvas (`1440px`, `1280px`, `1366px`) with `max-w-7xl` to prevent artificial mobile-width bottlenecks on desktop.
  - Retained strict mobile responsiveness (`320px–767px`) with zero horizontal overflow via fluid flex/grid layouts.
  - Fixed ESLint assignment warning in `Chip.tsx` and validated with `npm run lint` and `npm run build`.


## Collaboration Protocol - Two-Developer Architecture (2026-11-13)
- **Status**: Formally Adopted
- **Core Principles**:
  1. Respect Existing Work: Never modify or delete another developer's work unnecessarily (e.g., preserving `com.smartbus.system`, `systemApi.ts`, `SystemStatusPage.tsx`).
  2. Feature-Based Organization:
     - Frontend: Features modularized into clean feature folders (`src/features/auth`, `src/features/booking`, `src/features/journey`, `src/features/system`, with shared primitives in `src/components/ui` and `src/components/layout`).
     - Backend: Feature packages isolated (`com.smartbus.system`, `com.smartbus.auth`, etc.).
  3. Strict Separation of Concerns: Clear API boundaries between frontend and backend.
  4. Single Monorepo Root: No duplicate project structures or redundant application entry points.
  5. Shared Component Reuse: Maximize reuse of UI kit (`JourneyLine`, `PillButton`, `GlassCard`, `Input`, `Chip`, `PerforatedTicket`, `BottomBar`).
  6. Git & Branch Safety: Work confined to assigned feature branches; no branch overwrites, forced merges, or destructive git rebases without explicit agreement.
  7. File Preservation: No files deleted without verifying imports and runtime dependencies.
  8. Scoped Feature Work: Modifications limited strictly to the assigned feature scope.
  9. Continuous Documentation: All changes, decisions, and problem resolutions logged in `docs/PROJECT_LOG.md`.
  10. Integration Path: Changes integrated via Git branches and GitHub Pull Requests.
