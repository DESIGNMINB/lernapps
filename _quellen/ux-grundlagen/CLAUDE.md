# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive educational web app for teaching UX/UI design fundamentals (German language). 13 learning modules covering theory, standards, interactive labs, and AI-powered quizzes.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint (ts,tsx, zero warnings)
npm run preview   # Preview production build
```

No test framework is configured.

## Architecture

**Stack**: React 18 + TypeScript, Vite, Tailwind CSS, ShadUI (Radix), Supabase backend, Google Gemini AI (via Supabase Functions)

**File structure**: Flat layout — no `src/` directory. All source files (`App.tsx`, `main.tsx`, `types.ts`, `constants.ts`) live at project root. Entry point: `index.html` → `main.tsx` → `App.tsx`.

**Routing**: No router library. `App.tsx` manages a `ViewState` enum via `useState` and renders views through a switch statement. `Navigation.tsx` provides sidebar + mobile drawer. Navigation groups are defined inline in `Navigation.tsx` (not driven by config).

**View pattern**: Each learning module is a standalone view component in `components/` (e.g., `FundamentalsView.tsx`, `TheoryView.tsx`). To add a new module: add a `ViewState` enum value in `types.ts`, create the view component, add the case in `App.tsx`, and add a nav entry in `Navigation.tsx`. Note: enum names don't always match component names (e.g., `ViewState.METHODS` → `DesignMethodsView`, `ViewState.LAB` → `BadUiLab`).

**Data**: Static educational content lives in `constants.ts` with typed interfaces in `types.ts`. Quiz questions come from Gemini AI via `services/geminiService.ts` with extensive fallback data hardcoded in the same file.

**UI components**: `components/ui/` contains ~48 ShadUI components (Radix primitives + Tailwind). Use these for all UI elements. Icons: `lucide-react`. Animation: `motion` (Framer Motion).

**Styling**: Tailwind utility classes with HSL CSS variables for theming (defined in `styles/globals.css`). Dark mode via class strategy. Color palette: stone/gray primary, orange accents.

**Backend**: Supabase client in `utils/supabase/client.ts`, project config in `utils/supabase/info.ts`. Edge functions in `supabase/functions/server/` — uses Hono framework with OpenAI SDK (Deno runtime). The `/chat` endpoint powers AI quiz generation.

## File Organization

**Key files**:
- `App.tsx`: Main app component with view routing via `ViewState`
- `Navigation.tsx`: Sidebar navigation with mobile responsive drawer
- `constants.ts`: All static educational content and module data
- `types.ts`: TypeScript interfaces for `ViewState` enum and data structures
- `services/geminiService.ts`: Gemini AI integration for quiz generation with fallback data

**Component hierarchy**:
- View components (e.g., `FundamentalsView.tsx`) — full-page module content
- UI components in `components/ui/` — reusable ShadUI + Radix elements
- Utility functions — form handling, Supabase operations

## Common Development Tasks

**Adding a new learning module**:
1. Add `MODULE_NAME` to `ViewState` enum in `types.ts`
2. Create `components/ModuleNameView.tsx` with module content
3. Add a case in `App.tsx` `renderContent()` switch statement
4. Add navigation entry in `Navigation.tsx` under appropriate group

**Updating static content**: Edit `constants.ts` and corresponding `types.ts` interfaces. Changes hot-reload in dev mode.

**Quiz generation**: `services/geminiService.ts` calls Gemini via Supabase Functions. Fallback data in the same file is used if API fails.
