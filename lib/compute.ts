import type { BreakTemplate, BreakState, ComputedBreakState, SignalType } from './types'

export function getTemplateTeamCount(template: BreakTemplate): number {
  return template.teams.length
}

export function deriveSignal(fairValue: number, priceInput: number | null): SignalType {
  if (priceInput === null) return 'FAIR'
  if (priceInput === 0) return fairValue > 0 ? 'STRONG_BUY' : 'FAIR'

  const ratio = fairValue / priceInput
  if (ratio < 0.9) return 'OVERPRICED'
  if (ratio < 1.05) return 'FAIR'
  if (ratio < 1.2) return 'VALUE'
  return 'STRONG_BUY'
}

export function computeBreakState(
  template: BreakTemplate,
  state: BreakState,
): ComputedBreakState {
  const remainingTeams = template.teams.filter(
    (t) => !state.removedTeamIds.has(t.id),
  )
  const remainingSpots = remainingTeams.length
  const remainingValue = remainingTeams.reduce((sum, t) => sum + t.weight, 0)
  const fairValue = remainingSpots > 0 ? remainingValue / remainingSpots : 0
  const edge = state.priceInput !== null ? fairValue - state.priceInput : null
  const signal = deriveSignal(fairValue, state.priceInput)

  return { remainingTeams, remainingSpots, remainingValue, fairValue, edge, signal }
}
