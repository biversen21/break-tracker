'use client'

import { useMemo, useState } from 'react'
import SignalDisplay from '@/components/SignalDisplay'
import PriceInput from '@/components/PriceInput'
import TeamGrid from '@/components/TeamGrid'
import TemplateSelector from '@/components/TemplateSelector'
import { BREAK_TEMPLATES, DEFAULT_TEMPLATE_ID } from '@/lib/templates'
import { useBreakState } from '@/state/useBreakState'
import { computeBreakState } from '@/lib/compute'

export default function HomePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATE_ID)
  const { state, toggleRemovedTeam, togglePurchasedTeam, setPriceInput, resetBreakState } = useBreakState()

  const selectedTemplate =
    BREAK_TEMPLATES.find((t) => t.id === selectedTemplateId) ?? BREAK_TEMPLATES[0]!

  function handleSelectTemplate(templateId: string) {
    setSelectedTemplateId(templateId)
    resetBreakState()
  }

  const computed = useMemo(
    () => computeBreakState(selectedTemplate, state),
    [selectedTemplate, state],
  )

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 pt-6 pb-12 gap-6 max-w-2xl mx-auto w-full">
      <header className="w-full flex flex-col items-center gap-0.5">
        <h1 className="text-base font-semibold tracking-tight text-gray-300">
          {selectedTemplate.name}
        </h1>
        <p className="text-xs text-gray-700 uppercase tracking-widest">Break Tracker</p>
      </header>

      <TemplateSelector
        templates={BREAK_TEMPLATES}
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={handleSelectTemplate}
      />

      <SignalDisplay
        signal={computed.signal}
        fairValue={computed.fairValue}
        edge={computed.edge}
        remainingSpots={computed.remainingSpots}
      />

      <PriceInput value={state.priceInput} onChange={setPriceInput} />

      <div className="w-full border-t border-gray-800/60 pt-5">
        <TeamGrid
          teams={selectedTemplate.teams}
          removedTeamIds={state.removedTeamIds}
          purchasedTeamIds={state.purchasedTeamIds}
          onToggleRemovedTeam={toggleRemovedTeam}
          onTogglePurchasedTeam={togglePurchasedTeam}
        />
      </div>
    </main>
  )
}
