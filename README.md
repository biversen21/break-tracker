# Break Tracker

Real-time decision signal for sports card breaks.

## What This Is

Break Tracker tells you whether a break is worth buying into — right now, while the stream is live.

Sports card breaks are auctioned in real-time on platforms like Whatnot. As teams sell, the remaining spots get cheaper relative to their collective value. Break Tracker watches that shift and outputs a single trust signal so you can act fast without doing math in your head.

No accounts. No backend. No data leaves your browser.

## Core Interaction Loop

1. **Select a break template** — choose the product and sport
2. **Click teams off as they hit** — remove sold or skipped spots
3. **Enter the current asking price** — optional, but unlocks the full signal
4. **Read the signal** — buy, pass, or watch

## Signal System

| Signal | Meaning |
|---|---|
| 🔴 Overpriced | Price is above fair value — skip it |
| 🟡 Fair | Roughly at value — neutral |
| 🟢 Value | Meaningfully below fair value — worth considering |
| 🔥 Strong Buy Zone | Well below fair value — strong edge |

Signals are directional, not precise. The goal is fast trust, not exact EV modeling. Numbers are shown as context — the signal is the message.

## Tech Stack

- **Next.js** — static export, no server
- **React** — local state only (`useState`)
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — no CSS-in-JS
- **Vitest** — unit tests for compute logic

## Development Philosophy

This is a decision tool, not a platform. The governing rules are in [`CLAUDE.md`](./CLAUDE.md).

Key constraints:
- Frontend only — no backend, no API routes, no database
- No external state libraries — `useState` and `useMemo` only
- All compute is synchronous and pure
- Signal computation is always `< 1ms`
- No feature is added until there is a real reason for it

## Getting Started

```bash
npm install
npm run dev    # http://localhost:3000
npm run test   # unit tests
npm run build  # static export to /out
```

## Project Structure

```
/app          Next.js routes and root layout
/components   UI components — no compute logic
/lib          Pure functions: compute, types, templates
/state        React hooks for session state
/tests        Unit tests (one file per module)
```

## Current Scope (v1)

**Included:**
- Manual template selection (NBA, NFL, MLB)
- Live signal computation from remaining teams
- Local interaction state — toggle teams out, mark purchased
- One-level undo
- Reset break without changing template
- Keyboard shortcuts (`Esc`, `⌘Z`, `R`)

**Not included:**
- Backend or server of any kind
- User accounts or authentication
- Persistence or history
- Analytics or tracking
- Automation or integrations
- Template editor

## Testing

Compute logic (`lib/compute.ts`) is fully unit tested — all threshold boundaries, edge cases, and NaN guards. UI is not snapshot tested. The compute layer is what matters; visual correctness is verified manually.

---

*Build a fast, trustworthy decision tool — not a platform.*
