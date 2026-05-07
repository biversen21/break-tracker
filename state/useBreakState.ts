'use client'

import { useState } from 'react'
import type { BreakState } from '@/lib/types'

const EMPTY_STATE: BreakState = {
  removedTeamIds: new Set(),
  purchasedTeamIds: new Set(),
  priceInput: null,
}

type UseBreakStateReturn = {
  state: BreakState
  toggleRemovedTeam: (teamId: string) => void
  togglePurchasedTeam: (teamId: string) => void
  setPriceInput: (value: number | null) => void
  resetBreakState: () => void
  canUndo: boolean
  undoLastAction: () => void
}

export function useBreakState(): UseBreakStateReturn {
  const [state, setState] = useState<BreakState>({ ...EMPTY_STATE, removedTeamIds: new Set(), purchasedTeamIds: new Set() })
  const [previousState, setPreviousState] = useState<BreakState | null>(null)

  const canUndo = previousState !== null

  function toggleRemovedTeam(teamId: string) {
    setPreviousState(state)
    setState((prev) => {
      const next = new Set(prev.removedTeamIds)
      next.has(teamId) ? next.delete(teamId) : next.add(teamId)
      return { ...prev, removedTeamIds: next }
    })
  }

  function togglePurchasedTeam(teamId: string) {
    setPreviousState(state)
    setState((prev) => {
      const next = new Set(prev.purchasedTeamIds)
      next.has(teamId) ? next.delete(teamId) : next.add(teamId)
      return { ...prev, purchasedTeamIds: next }
    })
  }

  function setPriceInput(value: number | null) {
    // Only save undo state on null↔number transitions — not on every keystroke
    if (state.priceInput === null || value === null) {
      setPreviousState(state)
    }
    setState((prev) => ({ ...prev, priceInput: value }))
  }

  function resetBreakState() {
    setPreviousState(state)
    setState({ removedTeamIds: new Set(), purchasedTeamIds: new Set(), priceInput: null })
  }

  function undoLastAction() {
    if (previousState !== null) {
      setState(previousState)
      setPreviousState(null)
    }
  }

  return { state, toggleRemovedTeam, togglePurchasedTeam, setPriceInput, resetBreakState, canUndo, undoLastAction }
}
