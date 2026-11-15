# One Go Bus: Light Theme & Stitch Auth UI Architecture

## Overview
This document details the transition from the experimental dark mode to the production-ready **One Go Bus** light theme system, along with the high-fidelity translation of the Stitch design (`ID 9772835342865580419`) for the **Login** and **Register** pages.

---

## 1. Design Token System

The design tokens are declared in `frontend/src/index.css` using CSS custom properties in `:root` and registered with Tailwind CSS v4 via `@theme inline`.

| Token | Hex Value | Semantic Role | Tailwind Utility |
| :--- | :--- | :--- | :--- |
| `--canvas` | `#FBF9F5` | Primary background canvas | `bg-canvas`, `text-canvas` |
| `--surface` | `#FFFFFF` | Elevated card & container surface | `bg-surface`, `text-surface` |
| `--surface-2` | `#F5F3EF` | Low-elevation background / input fill | `bg-surface-2` |
| `--surface-3` | `#EFEEEA` | Medium-elevation panels & inactive chips | `bg-surface-3` |
| `--surface-4` | `#EAE8E4` | High-elevation surfaces | `bg-surface-4` |
| `--surface-5` | `#E4E2DE` | Highest-elevation surfaces | `bg-surface-5` |
| `--line` | `#C4C6CE` | Dividers, subtle borders, input outlines | `border-line` |
| `--ink` | `#1B1C1A` | Standard body typography | `text-ink` |
| `--ink-strong` | `#000D21` | High-contrast headings and active labels | `text-ink-strong` |
| `--ink-muted` | `#44474E` | Secondary body text, hints, placeholders | `text-ink-muted` |
| `--brand` | `#0B2341` | Primary Navy brand accent & CTA buttons | `bg-brand`, `text-brand` |
| `--brand-hover` | `#000D21` | Deep Navy hover state for primary CTAs | `hover:bg-brand-hover` |
| `--on-brand` | `#FFFFFF` | Text on brand surfaces | `text-on-brand` |
| `--accent` | `#A04100` | Saffron/terracotta highlight & badges | `bg-accent`, `text-accent` |
| `--accent-hover` | `#7A3000` | Deep terracotta hover state | `hover:bg-accent-hover` |
| `--on-accent` | `#FFFFFF` | Text on accent surfaces | `text-on-accent` |
| `--accent-bright`| `#FC7728` | Indicator dots & icon fills only | `bg-accent-bright`, `text-accent-bright` |
| `--accent-tint` | `#FFDBCB` | Soft terracotta badge & perk card fill | `bg-accent-tint` |
| `--on-accent-tint`| `#341000` | Deep terracotta text on tint backgrounds | `text-on-accent-tint` |
| `--success` | `#00522C` | Positive statuses & verified badges | `text-success`, `bg-success` |
| `--success-tint` | `#E3F6EC` | Soft green badge background | `bg-success-tint` |
| `--danger` | `#BA1A1A` | Validation errors and alert states | `text-danger`, `border-danger` |
| `--danger-tint` | `#FFDAD6` | Error banner background | `bg-danger-tint` |
| `--font-sans` | `Plus Jakarta Sans` | Primary brand typography | `font-sans` |

---

## 2. Stitch Component Mapping & Translation Rules

The Material-style tokens exported by Stitch were strictly translated to project tokens with **zero raw hex colors**:

- `bg-surface` → `bg-canvas`
- `bg-surface-container-lowest` → `bg-surface`
- `bg-surface-container-low` / `-container` / `-high` → `bg-surface-2` / `-3` / `-4`
- `bg-primary-container text-on-primary` → `bg-brand text-on-brand (hover:bg-brand-hover)`
- `text-primary` → `text-ink-strong`
- `text-on-surface-variant` → `text-ink-muted`
- `bg-secondary text-on-secondary` → `bg-accent text-on-accent`
- `bg-secondary-fixed` → `bg-accent-tint`
- `text-error / bg-error-container` → `text-danger / bg-danger-tint`
- `outline-variant` → `border-line`

---

## 3. Modular Component Structure (`frontend/src/features/auth/`)

To comply with the rule of modular files under 80–120 lines:

```text
frontend/src/
├── assets/
│   └── Login_Hero.webp           (323 KB) - 3344x1882 high-res Bengal illustration (Howrah Bridge, Victoria Memorial, Durga motif)
├── components/
│   └── brand/
│       └── Logo.tsx              (57 lines) - Navy rounded square with inline SVG numeral '1' & wordmark
├── features/
│   └── auth/
│       ├── AuthLayout.tsx        (126 lines) - Full-screen illustration background + iOS frosted glass card layout
│       ├── AuthField.tsx         (68 lines) - Accessible input with label, icons, aria tags, and error state
│       ├── PasswordField.tsx     (74 lines) - Password input with 44px toggle and strength meter
│       ├── AuthButton.tsx        (42 lines) - 48px Navy CTA with spinner loading state
│       └── AuthSocialButtons.tsx (29 lines) - Apple ID & Google one-tap buttons
└── pages/
    ├── LoginPage.tsx             (198 lines) - Full illustration view with segmented switcher & method tabs
    └── RegisterPage.tsx          (195 lines) - Full illustration view with Zod validation & student toggle
```

---

## 4. Fullscreen Hero Illustration & Viewport Alignment Architecture

1. **Fixed Viewport Background (`fixed inset-0 w-screen h-screen -z-10`)**:
   - Previously, putting `background-size: cover` directly on a scrolling container caused the image to zoom in and crop the sides whenever content height increased (as on the taller Register page).
   - Solution: The background illustration (`Login_Hero.webp`) is locked inside a fixed viewport container (`fixed inset-0 w-screen h-screen overflow-hidden`) with `object-cover object-bottom`.
   - Result: Both Login and Register pages share the **exact same 100vw × 100vh viewport scale**. The bus at the bottom-left, Howrah Bridge in the center, and Maa Durga on the right remain identical and perfectly positioned across route switches.
2. **Left Narrative Sky Placement**:
   - The brand headline (`Your journey begins here.`) and description are anchored at the top-left in the open sky area (`pt-2 sm:pt-4 lg:pt-6`), safely above the bus roof and road.
   - Speed Bus brand emblem matching the reference illustration.
3. **Card Symmetry & Height Balance**:
   - The Register page uses a compact 2-column grid for `Full Name` and `Mobile Phone Number`, reducing the card's vertical height by ~80px.
   - The glassmorphism card is constrained with `max-h-[calc(100vh-90px)] overflow-y-auto` so it never forces page scroll on compact laptop viewports.
   - The card sits at `max-w-[430px]` in the center-right column, preserving the right-hand margin where the Maa Durga artwork and floral embellishments shine through.
4. **iOS Glassmorphism**:
   - `bg-surface/85 backdrop-blur-xl border border-white/70 shadow-[0_20px_50px_rgba(0,13,33,0.12)] rounded-3xl`.
   - Native `-webkit-backdrop-filter: blur(20px)` support on macOS, iOS, Windows, and Android.
   - Smooth CSS transitions (`transition-all duration-200`) without FPS drops on low-end hardware.

---

## 4. Behavior & Accessibility Preservation

1. **State & Validation**:
   - `LoginPage`: Preserves email/password state, login mock delay, `tokenStorage.setToken`, `tokenStorage.setUser`, and origin redirection (`location.state?.from?.pathname || '/home'`).
   - `RegisterPage`: Preserves `useForm<RegisterFormData>` with `zodResolver(registerSchema)`, interactive password strength calculation, and automated login on submit.
2. **Accessibility (WCAG 2.1 AA)**:
   - Explicit `<label htmlFor={id}>` for all form controls.
   - Real `aria-invalid` and `aria-describedby` linking errors and hints to inputs.
   - Interactive touch targets strictly enforce `>= 44px` height (`min-h-[44px]`).
   - Clear focus rings (`focus:ring-2 focus:ring-brand`).
   - High color contrast between `text-ink-strong`, `text-ink-muted`, and `--surface` / `--canvas`.
3. **Stitch Fields Not Yet in Backend Scope**:
   - `phone` field in `RegisterPage` and `LoginPage`: Rendered with clean UI and hints, but not required in request payload (documented for backend Sprint 2/3).
   - `isStudent` toggle: Interactive UI switch provided for student privilege pass concession.

---

## 5. Verification Results

- **`npm run build`**: Passed cleanly (`tsc -b && vite build` bundled in 337ms with 0 errors).
- **`npm run lint`**: Passed with 0 errors and 0 warnings.
- **Raw Hex Audit**: Automated grep across all new files confirmed **0 raw hex values**.
- **Cross-Platform & Isolated**: No modifications to backend, Dockerfile, or other dark-themed pages.
