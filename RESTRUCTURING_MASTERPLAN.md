# 🏗️ Pioneer Academy 2.0: Restructuring Masterplan

**Status:** DRAFT
**Author:** Antigravity (Expert Systems Architect)
**Date:** 2026-01-10

## 1. Executive Summary & Audit

Upon reviewing the codebase, we have identified a critical bottleneck: **The "God Object" Pattern in `App.tsx`**.
Currently, `App.tsx` acts as the Router, State Manager, Business Logic Controller, and UI Layout all in one (97KB+). This makes the application:
1.  **Fragile:** A change in the shop can break the login.
2.  **Unscalable:** Adding new features increases the file size exponentially.
3.  **Insecure:** Core logic (economy, answers) is exposed in the main bundle.

The root directory is also cluttered with 50+ documentation files, obscuring the actual project structure.

## 2. Restructuring Strategy (The "Script")

We will adopt a **Modular Domain-Driven Design (MDDD)** adapted for React/Vite.

### Phase 1: Operation "Clean Slate" (Immediate)
*   **Objective:** Restore cognitive order.
*   **Action:**
    *   Create `_archive/docs` and move all `.md` audit files there.
    *   Create `_archive/scripts` and move non-critical `.ps1` scripts there.
    *   Keep only `package.json`, `vite.config.ts`, `.env`, and `README.md` in root.

### Phase 2: Architecture Injection
We will enforce the following structure:
```
src/
├── app/                # App-wide providers & setup
│   ├── routes/         # Routing definition (clean separation)
│   ├── providers/      # Contexts (AuthProvider, GameStateProvider)
│   └── layouts/        # MainLayout, AuthLayout
├── features/           # Feature-based Domains (Self-contained)
│   ├── auth/
│   ├── economy/        # Staking, Energy, Shop
│   ├── social/         # Feed, Comments
│   ├── education/      # Quiz, Lab, Courses
│   └── user/           # Profile, Dashboard
├── shared/             # Reusable UI components (Buttons, Cards)
└── lib/                # Third-party configs (Firebase, Pi Network)
```

### Phase 3: The Great Decoupling (Logic Extraction)
We will slice `App.tsx` into specialized hooks/contexts:
*   `useAuth()`: Handles Pi/Guest login.
*   `useEconomy()`: Handles Staking, Energy, Rewards.
*   `useProgression()`: Handles XP, Levels, Unlocks.

### Phase 4: Security & Anti-Cheat (The Fortress)
*   **Critical Vulnerability:** Quiz validation appears to be client-side.
*   **Fix:** Move answer validation to a Firebase Cloud Function.
*   **Obfuscation:** Ensure client only receives questions, never answers.

## 3. Immediate Action Script

I have prepared a script to:
1.  Clean the root directory.
2.  Scaffold the new folder structure.
3.  Protect the current `App.tsx` as `App.legacy.tsx` before we begin the surgical extraction.

**Ready to execute?**
