import { describe, it, expect } from 'vitest'
import { getTemplateTeamCount, computeBreakState, deriveSignal } from '@/lib/compute'
import { SAMPLE_TEMPLATE } from '@/lib/templates'
import type { BreakTemplate, BreakState } from '@/lib/types'

const emptyState = (): BreakState => ({
  removedTeamIds: new Set(),
  purchasedTeamIds: new Set(),
  priceInput: null,
})

describe('getTemplateTeamCount', () => {
  it('returns the correct team count for a populated template', () => {
    expect(getTemplateTeamCount(SAMPLE_TEMPLATE)).toBe(12)
  })

  it('returns 0 for an empty template', () => {
    const empty: BreakTemplate = { id: 'empty', name: 'Empty', teams: [] }
    expect(getTemplateTeamCount(empty)).toBe(0)
  })
})

describe('computeBreakState', () => {
  it('includes all teams when none removed', () => {
    const result = computeBreakState(SAMPLE_TEMPLATE, emptyState())
    expect(result.remainingSpots).toBe(12)
    expect(result.remainingTeams).toHaveLength(12)
  })

  it('excludes removed teams from remainingSpots and remainingValue', () => {
    const state = { ...emptyState(), removedTeamIds: new Set(['lak', 'gsw']) }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(result.remainingSpots).toBe(10)
    const expectedValue = SAMPLE_TEMPLATE.teams
      .filter((t) => !['lak', 'gsw'].includes(t.id))
      .reduce((s, t) => s + t.weight, 0)
    expect(result.remainingValue).toBe(expectedValue)
  })

  it('returns null edge and FAIR signal when priceInput is null', () => {
    const result = computeBreakState(SAMPLE_TEMPLATE, emptyState())
    expect(result.edge).toBeNull()
    expect(result.signal).toBe('FAIR')
  })

  it('returns correct edge when priceInput is set', () => {
    const state = { ...emptyState(), priceInput: 5 }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(result.edge).toBe(result.fairValue - 5)
    expect(typeof result.edge).toBe('number')
  })

  it('returns safe zero values for empty template', () => {
    const empty: BreakTemplate = { id: 'empty', name: 'Empty', teams: [] }
    const result = computeBreakState(empty, emptyState())
    expect(result.remainingSpots).toBe(0)
    expect(result.remainingValue).toBe(0)
    expect(result.fairValue).toBe(0)
    expect(result.edge).toBeNull()
    expect(Number.isNaN(result.fairValue)).toBe(false)
  })

  it('returns STRONG_BUY and no NaN when priceInput is 0', () => {
    const state = { ...emptyState(), priceInput: 0 }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(Number.isNaN(result.fairValue)).toBe(false)
    expect(Number.isNaN(result.edge as number)).toBe(false)
    expect(result.signal).toBe('STRONG_BUY')
  })

  it('clamps negative priceInput to 0 and returns STRONG_BUY', () => {
    const state = { ...emptyState(), priceInput: -50 }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(result.signal).toBe('STRONG_BUY')
    expect(Number.isNaN(result.fairValue)).toBe(false)
    expect(result.edge).toBe(result.fairValue)
  })

  it('all teams removed returns safe zero values', () => {
    const allIds = new Set(SAMPLE_TEMPLATE.teams.map((t) => t.id))
    const state = { ...emptyState(), removedTeamIds: allIds }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(result.remainingSpots).toBe(0)
    expect(result.remainingValue).toBe(0)
    expect(result.fairValue).toBe(0)
    expect(Number.isNaN(result.fairValue)).toBe(false)
  })

  it('unknown removed IDs are ignored and do not affect result', () => {
    const state = { ...emptyState(), removedTeamIds: new Set(['nonexistent-id-1', 'nonexistent-id-2']) }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(result.remainingSpots).toBe(12)
  })

  it('duplicate removed IDs (via Set) do not affect result', () => {
    const stateOnce = { ...emptyState(), removedTeamIds: new Set(['lak']) }
    const stateDupe = { ...emptyState(), removedTeamIds: new Set(['lak', 'lak']) }
    expect(computeBreakState(SAMPLE_TEMPLATE, stateOnce).remainingSpots)
      .toBe(computeBreakState(SAMPLE_TEMPLATE, stateDupe).remainingSpots)
  })

  it('clamps negative team weights to 0 in remainingValue', () => {
    const template: BreakTemplate = {
      id: 'neg',
      name: 'Negative Weights',
      teams: [
        { id: 'a', name: 'A', weight: 10 },
        { id: 'b', name: 'B', weight: -5 },
      ],
    }
    const result = computeBreakState(template, emptyState())
    expect(result.remainingValue).toBe(10)
    expect(Number.isNaN(result.fairValue)).toBe(false)
    expect(result.fairValue).toBe(5)
  })

  it('fairValue is never NaN regardless of input', () => {
    const cases: BreakState[] = [
      emptyState(),
      { ...emptyState(), priceInput: 0 },
      { ...emptyState(), priceInput: -1 },
      { ...emptyState(), removedTeamIds: new Set(SAMPLE_TEMPLATE.teams.map((t) => t.id)) },
    ]
    for (const state of cases) {
      const result = computeBreakState(SAMPLE_TEMPLATE, state)
      expect(Number.isNaN(result.fairValue)).toBe(false)
    }
  })

  it('edge is never NaN when priceInput is not null', () => {
    const cases = [0, 1, 100, -5]
    for (const price of cases) {
      const state = { ...emptyState(), priceInput: price }
      const result = computeBreakState(SAMPLE_TEMPLATE, state)
      expect(result.edge).not.toBeNull()
      expect(Number.isNaN(result.edge as number)).toBe(false)
    }
  })
})

describe('deriveSignal — thresholds', () => {
  it('returns FAIR when priceInput is null', () => {
    expect(deriveSignal(10, null)).toBe('FAIR')
  })

  it('returns STRONG_BUY when priceInput is 0 and fairValue > 0', () => {
    expect(deriveSignal(10, 0)).toBe('STRONG_BUY')
  })

  it('returns FAIR when both fairValue and priceInput are 0', () => {
    expect(deriveSignal(0, 0)).toBe('FAIR')
  })

  it('clamps negative priceInput to 0 → STRONG_BUY when fairValue > 0', () => {
    expect(deriveSignal(10, -20)).toBe('STRONG_BUY')
  })

  it('returns OVERPRICED when ratio < 0.9', () => {
    expect(deriveSignal(8, 10)).toBe('OVERPRICED')
  })

  it('returns FAIR at ratio boundary 0.9', () => {
    expect(deriveSignal(9, 10)).toBe('FAIR')
  })

  it('returns FAIR just below ratio 1.05', () => {
    expect(deriveSignal(10.4, 10)).toBe('FAIR')
  })

  it('returns VALUE at ratio 1.05', () => {
    expect(deriveSignal(10.5, 10)).toBe('VALUE')
  })

  it('returns VALUE just below ratio 1.2', () => {
    expect(deriveSignal(11.9, 10)).toBe('VALUE')
  })

  it('returns STRONG_BUY at ratio 1.2', () => {
    expect(deriveSignal(12, 10)).toBe('STRONG_BUY')
  })

  it('returns STRONG_BUY well above ratio 1.2', () => {
    expect(deriveSignal(20, 10)).toBe('STRONG_BUY')
  })
})
