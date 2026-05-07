# INITIAL_SETUP.md — Break Tracker v1

## Stack

| Tool | Reason |
|---|---|
| **Next.js** (App Router, static export) | Zero-config React framework; static export keeps the app fully client-side with no server required |
| **TypeScript** (strict mode) | Catches state shape errors at compile time — critical for correct derived value computation |
| **Tailwind CSS** | Utility-first; no runtime cost, no style abstraction layer |
| **Vitest** | Fast, zero-config test runner with native ESM support; no browser required |
| **React hooks only** | `useState` and `useReducer` cover all state needs in v1; no external libraries |

---

## Repository Structure

```
/app
  layout.tsx        — root layout, global styles
  page.tsx          — single page entry point

/components
  SignalDisplay.tsx  — primary output: emoji + label
  TeamList.tsx       — team grid with remove toggle
  PriceInput.tsx     — price entry field

/lib
  types.ts           — shared TypeScript types (Team, BreakTemplate, BreakState, Signal)
  constants.ts       — signal thresholds, sample template data
  signal.ts          — getSignal(), computeFairValue()

/tests
  signal.test.ts     — unit tests for all compute functions

/styles
  globals.css        — Tailwind base imports only
```

No `/hooks`, `/state`, or `/templates` directories until real files justify their existence.

---

## Initial Dependencies

**Production:**
```json
{
  "next": "latest",
  "react": "latest",
  "react-dom": "latest"
}
```

**Dev:**
```json
{
  "typescript": "latest",
  "@types/react": "latest",
  "@types/node": "latest",
  "tailwindcss": "latest",
  "postcss": "latest",
  "autoprefixer": "latest",
  "vitest": "latest",
  "@vitejs/plugin-react": "latest"
}
```

No additional dependencies. Every addition requires explicit bundle cost justification.

---

## Required Config

**Tailwind** (`tailwind.config.ts`):
```ts
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

**TypeScript** (`tsconfig.json` — key settings):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": { "@/*": ["./*"] }
  }
}
```

**Vitest** (`vitest.config.ts`):
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
```

**Next.js** (`next.config.ts`):
```ts
export default {
  output: 'export',
}
```

---

## Initial Code Standards

**File naming:** `kebab-case` for all files except components. Components use `PascalCase.tsx`.

**Component naming:** `PascalCase`. One component per file. Name matches the file.

**Hook naming:** `useX` prefix. Only create if used in more than one component.

**Utility naming:** `camelCase` functions. Verb-first: `getSignal`, `computeFairValue`.

**Import ordering:**
1. React and Next.js imports
2. Third-party imports
3. Internal imports (`@/lib/...`, `@/components/...`)
4. Type-only imports (`import type { ... }`)

**TypeScript:**
- No `any`. No type assertions unless unavoidable.
- All compute functions must have explicit return types.
- `Signal` is a union type, not a string: `type Signal = 'STRONG_BUY' | 'VALUE' | 'FAIR' | 'OVERPRICED'`

---

## Initial Template

One hardcoded template in `/lib/constants.ts`. Static data only — no fetch, no async.

```ts
import type { BreakTemplate } from './types'

export const SIGNAL_THRESHOLDS = {
  STRONG_BUY: 0.85,
  VALUE: 0.98,
  FAIR: 1.10,
}

export const SAMPLE_TEMPLATE: BreakTemplate = {
  id: 'prizm-hobby-24',
  name: '2024 Prizm Hobby — Random Teams',
  teams: [
    { id: 'lak', name: 'Lakers', weight: 10 },
    { id: 'gsw', name: 'Warriors', weight: 9 },
    { id: 'bos', name: 'Celtics', weight: 9 },
    { id: 'mia', name: 'Heat', weight: 7 },
    { id: 'chi', name: 'Bulls', weight: 6 },
    { id: 'nyc', name: 'Knicks', weight: 6 },
    { id: 'dal', name: 'Mavericks', weight: 8 },
    { id: 'den', name: 'Nuggets', weight: 7 },
    // fill to 30 teams
  ],
}
```

Weights represent relative market demand. They inform `fairValue` — higher weight = higher share of break value.

---

## Initial Testing Setup

- Vitest only. No React Testing Library, no Playwright, no browser runner.
- First tests cover `getSignal` and `computeFairValue` exclusively.
- Tests live in `/tests/signal.test.ts`.

Minimum test coverage before Phase 4 is complete:
- `getSignal` — all four threshold boundaries including exact boundary values
- `computeFairValue` — normal case, 0 remaining teams, single team remaining
- `computeFairValue` — `null` price input returns `null` signal
- No `NaN` returned from any input combination

---

## First Milestone

> **Clickable local UI with live signal updates and no backend.**

The app boots, a team grid renders from the hardcoded template, clicking teams removes them from the remaining pool, entering a price produces a live signal, and all compute logic is unit tested.

---

## Success Criteria

- [ ] `next dev` boots with zero errors
- [ ] No TypeScript errors in strict mode
- [ ] Clicking a team updates the signal in < 16ms (one frame)
- [ ] Entering a price updates the signal within 150ms (debounce window)
- [ ] `getSignal` and `computeFairValue` return correct values for all inputs
- [ ] Vitest passes with no failures
- [ ] No `NaN` reachable from any user interaction
- [ ] Signal is the largest, most visible element on screen
