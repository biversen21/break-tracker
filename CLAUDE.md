# CLAUDE.md — Break Tracker Development Rules

## What This Product Is

A real-time decision signal tool for sports card breaks. Users are in live streams, emotional, and need fast trust signals — not data to interpret.

Output is always one of: 🔴 Overpriced / 🟡 Fair / 🟢 Value / 🔥 Strong Buy Zone

Numbers are context, never the message.

---

## Non-Negotiable Rules

- No backend. No server. No API calls. All logic runs client-side.
- No database. No persistence. No localStorage for state (session-only).
- No authentication. No user accounts. No identity.
- No external state libraries (no Redux, Zustand, Jotai, etc.). React `useState` and `useReducer` only.
- No CSS-in-JS runtime libraries (no styled-components, Emotion). Use Tailwind or CSS modules.
- Signal output must always be computed in < 1ms. It must never be async.
- The primary signal (emoji + label) must be visible without scrolling on any device.
- Never render raw computed numbers as the primary UI element. Numbers are always secondary.

---

## Architecture Boundaries

**Allowed:**
- Next.js (App Router, static export)
- React hooks for all state
- Tailwind CSS for styling
- Plain TypeScript utility functions for computation
- `useMemo` for derived values

**Not Allowed:**
- Server components that fetch data
- API routes
- Any npm package that adds > 10KB gzipped to the bundle without clear justification
- Class components
- Context API for anything other than a single top-level config value (e.g., theme)

---

## State Model

Track exactly three things:

```ts
type BreakState = {
  teams: Team[];           // full list, static after load
  removed: Set<string>;    // team IDs clicked off (not in break)
  purchased: Set<string>;  // team IDs the user bought (optional)
  priceInput: number | null;
};
```

Derived values (never stored in state):
- `remainingTeams` — filter from `teams` minus `removed`
- `remainingValue` — sum of weights of `remainingTeams`
- `fairValue` — `remainingValue / remainingTeams.length`
- `signal` — derived from `fairValue` vs `priceInput`

**Rules:**
- Derived values are computed inline or with `useMemo`. Never stored in state.
- State updates are synchronous. No async state mutations.
- Never nest state. Flat structures only.
- `removed` and `purchased` use `Set<string>` keyed by team ID. No arrays of objects for these.

---

## Signal Computation

```ts
function getSignal(fairValue: number, price: number): Signal {
  const ratio = price / fairValue;
  if (ratio < 0.85) return 'STRONG_BUY';
  if (ratio < 0.98) return 'VALUE';
  if (ratio < 1.10) return 'FAIR';
  return 'OVERPRICED';
}
```

- Thresholds live in a single `constants.ts` file. Nowhere else.
- This function is pure. It takes numbers and returns a string. No side effects.
- Must have unit tests. This is the core of the product.

---

## Component Design Rules

**Split a component when:**
- It has its own local state unrelated to the parent
- It renders a repeated unit (e.g., each team in a list)
- It is reused in more than one place

**Do NOT split a component when:**
- The only reason is "it's getting long"
- The split would require threading props through a new intermediate component
- The extracted component would never be reused and has no independent state

**Max component depth for any feature: 3 levels.** If you're going deeper, the component model is wrong.

**Props:**
- No prop drilling past 2 levels. Lift state or rethink layout.
- No "god props" (objects with 10+ fields passed to a child). Pass what the child needs.

---

## Performance Rules

These must always be O(1) or trivially fast:

- Signal computation (`getSignal`)
- Rendering the signal display
- Any click handler on team removal

**Avoid:**
- `useEffect` for computing derived values — use `useMemo` or inline computation
- Sorting or filtering inside render without `useMemo`
- Re-rendering the full team list on every price keystroke — debounce price input at 150ms or derive signal only from the final committed value

---

## Validation Rules

**Price input:**
- Accept only positive numbers
- Clamp to a reasonable max (e.g., $10,000) to prevent display bugs
- Treat empty string and 0 as "no price entered" — show no signal
- No signal is shown if `priceInput` is null

**Team data:**
- Validate on load that all teams have a unique ID and a numeric weight > 0
- Fail loudly in development (`console.error` + skip invalid entries)
- Never silently propagate bad data into signal computation

**Defensive coding:**
- Never assume `remainingTeams.length > 0` without checking — guard division by zero in `fairValue`
- Treat all external data (even static JSON) as untrusted until validated

---

## Testing Rules

**Must have unit tests:**
- `getSignal(fairValue, price)` — all threshold boundaries
- `computeFairValue(teams, removed)` — including empty remaining set
- Any pure utility function in `lib/`

**Should NOT be tested:**
- Component rendering snapshots
- Click handlers in isolation
- Tailwind class application
- Static data files

**Testing approach:**
- Use Vitest (or Jest if already configured). No testing framework that requires a browser.
- Tests live in `__tests__/` adjacent to the file under test or in a top-level `tests/` directory.
- No mocking unless you are isolating a network call (there are none in V1).
- Each test file should be readable in < 2 minutes. If it isn't, it's too complex.

---

## Smell Detection

**Overengineering signals:**
- A new file is created to hold a function used in exactly one place
- A custom hook is created that only wraps one `useState` call
- A component is split to satisfy a line-count rule rather than a design rule
- An abstraction is named after a pattern ("Factory", "Manager", "Provider") rather than the domain
- A type has more than 2 levels of nesting

**Unnecessary abstraction signals:**
- You can't explain why a helper exists without referencing "future use"
- Removing the helper would require zero changes to calling code logic
- The abstraction has a generic name and a specific implementation

**Premature optimization signals:**
- `useMemo` on a computation that touches < 32 items
- Virtualized lists for < 100 items
- Code splitting a route that loads in < 200ms already
- Caching values that change on every user action anyway

---

## Refactoring Rules

**Refactor when:**
- A bug was caused by unclear state flow
- The same logic appears in 3+ places with slight variations
- A component is doing two conceptually separate jobs

**Do NOT refactor when:**
- The code works and the reason is "it could be cleaner"
- A PR is already in review
- The refactor introduces new abstractions without removing old ones

**Rule:** Refactors must reduce total lines of code or total number of files, or clearly consolidate duplicated logic. Refactors that add files and lines must be rejected.

---

## Iteration Philosophy

- Ship the simplest version that produces a correct signal
- Add configuration only when the absence causes real user pain, not theoretical pain
- Extend the state model only when a new user-facing behavior requires it — never pre-emptively
- Before adding any new component, file, or hook, ask: "Would removing this break a user-visible behavior?" If no, don't add it.
- V1 is a static frontend. V2 might add data. Design V1 as if V2 will never exist. Migrate if V2 happens.

---

## File Structure

```
/app
  page.tsx          # single page, root layout
/components
  SignalDisplay.tsx  # the primary output: signal + label
  TeamList.tsx       # list of teams with remove toggle
  PriceInput.tsx     # price entry
/lib
  signal.ts          # getSignal(), computeFairValue()
  constants.ts       # thresholds, team weights
  types.ts           # shared TypeScript types
/tests
  signal.test.ts
```

Adding a new top-level directory requires justification in the PR description.

---

## Definition of Done

A feature is done when:
1. Signal output is correct for all threshold cases
2. Unit tests pass for any pure logic added
3. The UI renders the signal as the primary element
4. No new abstractions were added that aren't used
5. Bundle size did not increase by more than 5KB gzipped
