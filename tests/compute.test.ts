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
    const state = emptyState()
    state.removedTeamIds = new Set(['lak', 'gsw'])
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(result.remainingSpots).toBe(10)
    const expectedValue = SAMPLE_TEMPLATE.teams
      .filter((t) => !['lak', 'gsw'].includes(t.id))
      .reduce((s, t) => s + t.weight, 0)
    expect(result.remainingValue).toBe(expectedValue)
  })

  it('returns null edge when priceInput is null', () => {
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

  it('does not return NaN when priceInput is 0', () => {
    const state = { ...emptyState(), priceInput: 0 }
    const result = computeBreakState(SAMPLE_TEMPLATE, state)
    expect(Number.isNaN(result.fairValue)).toBe(false)
    expect(Number.isNaN(result.edge)).toBe(false)
    expect(result.signal).toBe('STRONG_BUY')
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

  it('returns OVERPRICED when ratio < 0.9 (price far above fair)', () => {
    // fairValue=9, price=10 → ratio=0.9 (boundary, should be FAIR)
    expect(deriveSignal(8, 10)).toBe('OVERPRICED')  // ratio=0.8
  })

  it('returns FAIR at ratio boundary 0.9', () => {
    expect(deriveSignal(9, 10)).toBe('FAIR')  // ratio=0.9
  })

  it('returns FAIR just below ratio 1.05', () => {
    expect(deriveSignal(10.4, 10)).toBe('FAIR')  // ratio=1.04
  })

  it('returns VALUE at ratio 1.05', () => {
    expect(deriveSignal(10.5, 10)).toBe('VALUE')  // ratio=1.05
  })

  it('returns VALUE just below ratio 1.2', () => {
    expect(deriveSignal(11.9, 10)).toBe('VALUE')  // ratio=1.19
  })

  it('returns STRONG_BUY at ratio 1.2', () => {
    expect(deriveSignal(12, 10)).toBe('STRONG_BUY')  // ratio=1.2
  })

  it('returns STRONG_BUY well above ratio 1.2', () => {
    expect(deriveSignal(20, 10)).toBe('STRONG_BUY')  // ratio=2.0
  })
})
