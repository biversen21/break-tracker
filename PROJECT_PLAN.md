# PROJECT_PLAN.md — Break Tracker v1

## Project Goal

Build a real-time decision signal tool for sports card breaks. A user watches a live break on Whatnot, clicks off teams as they sell, optionally enters the current asking price, and receives an instant signal: 🔴 Overpriced / 🟡 Fair / 🟢 Value / 🔥 Strong Buy Zone.

The tool produces one output. That output must be immediate and unambiguous.

---

## Core User Flow

1. Open the app
2. Select a break template (e.g., "24 Prizm Hobby — Random Teams")
3. As teams sell in the stream, click them off the grid
4. Optionally enter the current asking price
5. Read the signal instantly — no interpretation required

The entire loop must work without a page reload, a network call, or a login.

---

## v1 Scope

**Included:**
- One hardcoded break template (can be swapped via static data)
- Team grid with remove toggle
- Optional price input
- Live signal display (emoji + label)
- Fair value and ratio visible as secondary context
- Client-side compute only

**Not included:**
- Multiple simultaneous templates
- User-created templates
- Saving or restoring session state
- Any form of accounts or identity
- Analytics or tracking
- Backend of any kind

---

## Technical Constraints

- Frontend only — Next.js static export, no server
- All state in React `useState` / `useReducer` — no external libraries
- All computation synchronous and client-side — signal never async
- No persistence — state resets on page reload (intentional)
- Tailwind for all styling — no CSS-in-JS
- No new dependency added without bundle cost justification

---

## Implementation Phases

### Phase 1 — Project Setup

**Goal:**
- Initialize Next.js app with App Router and static export
- Configure Tailwind CSS
- Create folder structure: `/app`, `/components`, `/lib`, `/tests`
- Add one hardcoded break template in `/lib/constants.ts`
- Verify CLAUDE.md rules are enforceable in the repo

**Deliverable:** Clean booting app at `localhost:3000` with no errors.

---

### Phase 2 — Static UI Skeleton

**Goal:**
- `SignalDisplay` component — placeholder signal, emoji + label, large and centered
- `TeamList` component — render all teams from template as a grid
- `PriceInput` component — number input, no logic yet
- Dark background layout with high-contrast signal area
- No state wired — all data hardcoded from template

**Deliverable:** Fully clickable UI with real team names and placeholder signal. Looks like the finished product.

---

### Phase 3 — Local Interaction State

**Goal:**
- Wire `removedTeamIds` state — clicking a team marks it as removed
- Visual distinction between active and removed teams (muted/strikethrough)
- Wire `purchasedTeamIds` state — optional secondary toggle
- Price input updates `priceInput` state (debounced at 150ms)
- No signal computation yet — signal display remains static

**Deliverable:** UI reflects all user interactions instantly. State is correct. Signal is still hardcoded.

---

### Phase 4 — Compute Engine

**Goal:**
- Implement `computeFairValue(template, removedTeamIds)` in `/lib/signal.ts`
- Implement `getSignal(fairValue, price)` in `/lib/signal.ts`
- Wire derived values into the component tree via `useMemo`
- Signal display updates live as teams are removed or price changes
- Guard all edge cases: 0 remaining teams, null price, division by zero

**Deliverable:** Fully live signal. Removing teams and entering a price produces the correct output in real time.

---

### Phase 5 — UX Refinement

**Goal:**
- Signal display is the dominant visual element — largest, highest contrast
- Fair value and ratio visible below signal as secondary context only
- Team grid is scannable and fast to click under stream pressure
- Price input is accessible and requires minimal typing
- Validate on real usage: does the tool feel instant? Is the signal readable at a glance?

**Deliverable:** Tool feels usable in a live break. No latency, no confusion, no wasted clicks.

---

### Phase 6 — Validation + Tests

**Goal:**
- Unit tests for `getSignal` — all four threshold boundaries
- Unit tests for `computeFairValue` — including 0 teams, null price, empty template
- Confirm no `NaN` returned from any compute function
- Manual validation against real break scenarios
- Confirm bundle size is within acceptable range

**Deliverable:** Stable, tested v1 build. Ready to use in a live break.

---

## Out of Scope

These will not be built in v1. Do not design for them.

- Backend, API routes, or server logic
- User accounts or authentication
- Persistence or saved sessions
- Multiple concurrent templates
- Custom template builder
- Analytics or event tracking
- AI-generated signals or recommendations
- Notifications or alerts
- Marketplace or Whatnot integrations
- Mobile app

---

## Build Principles

- Ship one phase at a time. Each phase must produce a working increment before the next begins.
- Hardcode first. Replace with dynamic data only once the shape is proven.
- No abstractions before reuse. Do not generalize until a second use case exists.
- Signal output is always the top priority. Every UI decision serves it.
- If a phase feels complex, it is too large. Split it.
