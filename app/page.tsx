'use client'

import SignalDisplay from '@/components/SignalDisplay'
import PriceInput from '@/components/PriceInput'
import TeamGrid from '@/components/TeamGrid'
import { SAMPLE_TEMPLATE } from '@/lib/templates'
import { useBreakState } from '@/state/useBreakState'

export default function HomePage() {
  const { state, toggleRemovedTeam, togglePurchasedTeam, setPriceInput } = useBreakState()

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8 gap-8 max-w-3xl mx-auto">
      <header className="w-full flex flex-col items-center gap-1">
        <h1 className="text-lg font-semibold tracking-tight text-gray-200">
          {SAMPLE_TEMPLATE.name}
        </h1>
        <p className="text-xs text-gray-600 uppercase tracking-widest">Break Tracker</p>
      </header>

      <SignalDisplay signal="FAIR" fairValue={142.50} ratio={1.04} />

      <PriceInput value={state.priceInput} onChange={setPriceInput} />

      <div className="w-full border-t border-gray-800 pt-6">
        <TeamGrid
          teams={SAMPLE_TEMPLATE.teams}
          removedTeamIds={state.removedTeamIds}
          purchasedTeamIds={state.purchasedTeamIds}
          onToggleRemovedTeam={toggleRemovedTeam}
          onTogglePurchasedTeam={togglePurchasedTeam}
        />
      </div>
    </main>
  )
}
