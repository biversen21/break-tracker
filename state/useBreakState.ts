'use client'

import { useState } from 'react'
import type { BreakState } from '@/lib/types'

type UseBreakStateReturn = {
  state: BreakState
  toggleRemovedTeam: (teamId: string) => void
  togglePurchasedTeam: (teamId: string) => void
  setPriceInput: (value: number | null) => void
}

export function useBreakState(): UseBreakStateReturn {
  const [state, setState] = useState<BreakState>({
    removedTeamIds: new Set(),
    purchasedTeamIds: new Set(),
    priceInput: null,
  })

  function toggleRemovedTeam(teamId: string) {
    setState((prev) => {
      const next = new Set(prev.removedTeamIds)
      next.has(teamId) ? next.delete(teamId) : next.add(teamId)
      return { ...prev, removedTeamIds: next }
    })
  }

  function togglePurchasedTeam(teamId: string) {
    setState((prev) => {
      const next = new Set(prev.purchasedTeamIds)
      next.has(teamId) ? next.delete(teamId) : next.add(teamId)
      return { ...prev, purchasedTeamIds: next }
    })
  }

  function setPriceInput(value: number | null) {
    setState((prev) => ({ ...prev, priceInput: value }))
  }

  return { state, toggleRemovedTeam, togglePurchasedTeam, setPriceInput }
}
