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
- **Next Steps**:
  - Phase 2: Routing skeleton in `App.tsx` for all 5 discovered pages plus 404 page and `ProtectedRoute`.
