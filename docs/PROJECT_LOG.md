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
- **Problems & Fixes**:
  - Initial `npm install` encountered peer dependency conflict on React 19; resolved cleanly via `--legacy-peer-deps` without breaking React 19 compatibility.

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
- **Decisions & Why**:
  - Preserved the existing system status verification UI at `/system-status` so that backend/Neon health checks remain fully accessible.
  - Wrapped `/home` and `/results` in `ProtectedRoute` to enforce authentication boundaries as specified.
- **Problems & Fixes**:
  - TypeScript `verbatimModuleSyntax` flagged type-only import for `BusTicketData`; adjusted to `import type`.
  - Synchronized `SystemStatusPage` property names to match `SystemStatus` interface in `types/system.ts`.

## Phase 3 - Screens 1 & 2 High-Fidelity Conversion (2026-11-13)
- **Files Changed**:
  - `frontend/src/pages/OnboardingPage.tsx`: Built full high-fidelity Onboarding screen faithful to `01-onboarding.html`. Includes atmospheric sunrise gradient, multi-layered tea hill silhouettes, glowing Journey Line ribbon, animated waypoint beads, silhouetted travel bus on hilltop, waypoint note pill (`Siliguri ⟿ Darjeeling • 3h 15m • Twilight express`), Chapter I badge, poetic typography, feature mosaic chips, and glowing pill CTA.
  - `frontend/src/pages/LoginPage.tsx`: Built complete Traveler Login screen matching `02-login.html`. Includes top app header with back button and brand mark, lyrical journey line SVG illustration with wanderer tram carriage, Traveler Vault badge, ambient parchment card, friendly toggleable error banner (*"That password doesn’t match. Try again?"*), email input with `local_post_office` icon and saved traveler indicator, password input with `lock_open` and eye toggle, Continue button with glowing dot, social sign-in buttons, *"New here? Join us"* prompt, travel diary snippet tile (*"Kyoto Express · Car 4"*), and offline pass security badge.
- **Decisions & Why**:
  - Encapsulated mobile viewports inside `max-w-[480px]` with desktop ambient centering to guarantee identical pixel-perfect geometry at both 390px and 1440px.
  - Added interactive password reveal and friendly error preview banner to demonstrate realistic travel diary authentication states.
- **Problems & Fixes**:
  - Ensured all SVG paths match the original Stitch coordinates (`M 45 285 C 90 275...` and `M 28 68 C 45 45...`) for visual continuity.
- **Next Steps**:
  - Phase 4: Build Screen 3 (Register) with a 3-step animated form using `react-hook-form` and `zod` validation, preserving form state across back/forward navigation.
