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

Static template data is not dynamic state. Teams belong to `BreakTemplate`, not `BreakState`.

```ts
type Team = {
  id: string;
  name: string;
  weight: number;
};

type BreakTemplate = {
  id: string;
  name: string;
  teams: Team[];
};

type BreakState = {
  removedTeamIds: Set<string>;
  purchasedTeamIds: Set<string>;
  priceInput: number | null;
};
```

Derived values (never stored in state):
- `remainingTeams` — filter from `template.teams` minus `removedTeamIds`
- `remainingValue` — sum of weights of `remainingTeams`
- `fairValue` — `remainingValue / remainingTeams.length`
- `signal` — derived from `fairValue` vs `priceInput`

**Rules:**
- Derived values are computed inline or with `useMemo`. Never stored in state.
- State updates are synchronous. No async state mutations.
- Never nest state. Flat structures only.
- `removedTeamIds` and `purchasedTeamIds` use `Set<string>` keyed by team ID. No arrays of objects for these.

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
- `getSignal` is pure. No side effects.
- Must have unit tests. This is the core of the product.

---

## Component Rules

**Split a component when:**
- It has its own local state unrelated to the parent
- It renders a repeated unit (e.g., each team in a list)
- It is reused in more than one place

**Do not split a component when:**
- The only reason is line count
- The split creates a pass-through wrapper
- The child would never be reused and has no independent state

**Max component depth: 3 levels.** Going deeper means the component model is wrong.

- No prop drilling past 2 levels. Lift state or restructure layout.
- No reusable abstractions until a second real use case exists.

---

## Performance Rules

Must always be O(1) or trivially fast:
- Signal computation (`getSignal`)
- Rendering the signal display
- Any click handler on team removal

**Rules:**
- Do not optimize preemptively. Measure before optimizing.
- No `useEffect` for computing derived values — use `useMemo` or inline computation.
- No sorting or filtering inside render without `useMemo`.
- Debounce price input at 150ms to avoid re-rendering the full team list on every keystroke.
- `useMemo` is justified only for clear rerender or computation problems.
- No complex caching in v1.

---

## Validation Rules

- Validate numeric inputs at boundaries only — not deep inside compute functions.
- Clamp impossible values instead of throwing errors.
- Never block UI interaction because of a validation failure.
- Prefer sane defaults over exceptions.
- Compute functions must never return `NaN` — guard all division and coerce bad inputs at the edge.
- Derived values must always have safe fallbacks (e.g., `fairValue` returns `0` when no teams remain, signal returns `null`).

---

## Testing Rules

**Must have unit tests:**
- All compute functions in `lib/`
- `getSignal` — every threshold boundary
- `computeFairValue` — including empty remaining set
- Edge cases: 0 remaining teams, `null` price input, duplicate toggles, empty templates

**Never test:**
- UI snapshots
- Tailwind class output
- Click handlers in isolation
- E2E flows in v1

**Approach:**
- Vitest (or Jest if already present). No browser-based test runner.
- Tests live in `/tests` at the project root. One file per module.
- No mocking — there are no network calls in v1.
- Each test file must be readable in under 2 minutes. If it isn't, it's too complex.

---

## Overengineering Smells

Stop and reconsider if you are:

- Introducing an abstraction before a second use case exists
- Adding global state without a measured need for it
- Building a generic component system when only one variant exists
- Optimizing render performance before profiling shows a problem
- Adding a configuration layer for logic that is fixed business rules
- Splitting a file or component because it "feels big"
- Writing a custom hook that is only called in one place

---

## Refactor Rules

- Refactor only after repeated pain — not after one instance of friction.
- 2 instances of duplication are acceptable. 3+ may justify abstraction.
- Prefer explicit, readable code over reusable abstractions in v1.
- A refactor that adds files and lines without removing old ones is scope creep, not a refactor.

---

## Implementation Standards

### File Organization

```
/app          → Next.js routes and root layout only
/components   → UI components, no compute logic
/lib          → pure compute functions, types, constants
/hooks        → shared stateful hooks only
/templates    → static break template data (JSON or TS)
/tests        → all test files
```

- Compute logic lives in `/lib`, never inside a component.
- No business logic inside JSX — derive it before the return statement.
- No catch-all `utils/` folder; name folders after what they contain.
- Adding a new top-level directory requires justification in the PR description.

### Hook Rules

- Hooks are for shared stateful behavior only.
- Do not create a hook used by a single component unless the internal complexity clearly justifies it.
- Derived values belong in `useMemo`, not in `useEffect` + `useState` pairs.

### Compute Function Rules

- All compute functions must be pure: same inputs → same output, every time.
- No hidden mutation of arguments or external state.
- No async logic inside compute functions.
- Guard every division — return `0` or `null` when the denominator is zero or the array is empty.
- Never return `NaN` or `Infinity` from a compute function.

### Styling Rules

- Tailwind only — no inline styles, no CSS-in-JS, no external style libraries.
- Keep conditional class logic simple; extract a variable if the expression exceeds one ternary.
- No animation libraries in v1.
- Prioritize readability and contrast over visual polish — this tool is used under time pressure.

### Dependency Rules

- Every new dependency must justify its bundle cost before being added.
- Prefer native browser and Node APIs when they cover the need.
- Do not add helper libraries (lodash, date-fns, etc.) unless they remove complexity that would otherwise require 50+ lines of custom code.
- No dependency that requires a build plugin or polyfill unless unavoidable.

---

## Build Sequence Rules

Build the smallest usable version first. Working software beats flexible architecture.

### Feature Development Order

Do not skip steps. Do not work ahead.

1. Static UI — render something real with hardcoded data
2. Local interaction — wire up clicks, toggles, inputs
3. Derived computation — connect live state to signal output
4. Signal tuning — validate thresholds against real scenarios
5. UX refinement — fix friction after real use
6. Performance optimization — only if profiling shows a problem

### UI Development Rules

- Build visible UI before abstractions.
- Hardcode examples first; replace with real data once the shape is proven.
- Do not design a component system before interaction patterns are understood.

### State Evolution Rules

- Start with local component state.
- Lift state only when two components genuinely need to share it.
- Add `useReducer` only when state transitions become difficult to reason about with `useState`.
- Do not introduce global state in v1 without measurable pain.

### Shipping Rules

- The app must remain deployable at all times.
- Avoid long-running branches or large rewrites.
- Prefer incremental improvements over big-bang redesigns.

### Decision Filter

Before adding any abstraction or dependency:

1. Does this reduce real complexity today?
2. Is there repeated pain already?
3. Would removing this make the app easier to understand?
4. Is this solving a current problem or a hypothetical future problem?

If the answer to #4 is "future problem," do not add it.

---

## Git Workflow Rules

- One branch per logical change. Never push new work to a branch whose PR has already been merged.
- After a PR merges, cut a new branch from `main` for the next change.
- Before referencing a PR URL, confirm it is open — not closed or merged.
- Branch names must describe the change, not the session or agent that made it.

---

## PR / Code Review Rules

### Every Change Must

- Improve clarity, speed, or usability
- Keep interaction latency effectively instant
- Avoid adding conceptual complexity
- Maintain a fast, distraction-free UI

### Reject Changes That

- Introduce unnecessary abstraction
- Add configuration without real need
- Create generic systems prematurely
- Split logic across too many files
- Add dependencies for trivial problems
- Move simple logic into "manager/service" patterns

### UI Review Rules

- Signal visibility is more important than visual polish
- Users must understand state instantly
- Important actions must require minimal clicks
- Avoid modal-heavy interactions
- Avoid dense tables and dashboard-style layouts

### State Review Rules

- Derived state must not be duplicated in stored state
- Effects must be rare and justified
- State transitions must remain obvious
- Avoid synchronization bugs caused by duplicated state

### Compute Review Rules

- Computation must remain deterministic
- Logic must remain inspectable and debuggable
- Thresholds and signal rules must be explicit — not hidden inside abstractions

### Test Review Rules

- New compute logic requires tests
- Edge cases must be covered
- Avoid brittle UI tests
- Prefer fewer high-signal tests over large test suites

### Final Standard

The codebase must feel: fast, obvious, minimal, difficult to misuse, and easy to modify under live product pressure.

If a change makes the system feel more "enterprise" than "tool," reject it.

---

## Development Workflow

### Task Scope Rules

- Implement one meaningful step at a time
- Do not build multiple systems simultaneously
- Do not anticipate future features unless explicitly requested
- Prefer incomplete but working increments over complete but unverified systems

### Response Rules

When asked to implement something:

- Start with the simplest viable version
- Prefer hardcoded data first; replace once the shape is proven
- Avoid speculative abstractions
- Explain tradeoffs briefly when relevant
- Ask for clarification only when ambiguity blocks implementation

### Output Rules

For implementation tasks:

- Provide complete file contents when modifying files
- Avoid partial snippets unless specifically requested
- Keep code immediately runnable
- Do not omit imports
- Do not leave TODO placeholders unless explicitly requested

### Coding Rules

- Prioritize readability over conciseness
- Avoid magic behavior
- Avoid hidden side effects
- Keep event flow easy to trace
- Prefer explicit naming

### Error Handling Rules

- Fail safely — never crash the UI
- Prefer resilient defaults over thrown exceptions
- Surface only actionable errors to users
- Swallow and log internal errors; expose user-facing ones clearly

### UX Rules

- Interactions must feel instant
- Minimize required typing
- Avoid unnecessary confirmations
- Every click must produce obvious, immediate feedback

### Communication Rules

- Be concise
- Avoid long explanations
- Avoid architectural essays
- Focus on implementation quality and tradeoffs

### Final Principle

This product is a fast decision tool, not a platform. Every implementation decision must preserve:

- Speed
- Clarity
- Trust
- Low cognitive load

---

## Definition of Done

A feature is done when:
1. Signal output is correct for all threshold cases
2. Unit tests pass for any pure logic added
3. The UI renders the signal as the primary element
4. No new abstractions were added that aren't used
5. Bundle size did not increase by more than 5KB gzipped
