export type Team = {
  id: string
  name: string
  weight: number
}

export type BreakTemplate = {
  id: string
  name: string
  teams: Team[]
}

export type BreakState = {
  removedTeamIds: Set<string>
  purchasedTeamIds: Set<string>
  priceInput: number | null
}

export type SignalType = 'STRONG_BUY' | 'VALUE' | 'FAIR' | 'OVERPRICED'
