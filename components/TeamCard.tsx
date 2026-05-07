import type { Team } from '@/lib/types'

type Props = {
  team: Team
  removed: boolean
  purchased: boolean
  onToggleRemoved: () => void
  onTogglePurchased: () => void
}

export default function TeamCard({ team, removed, purchased, onToggleRemoved, onTogglePurchased }: Props) {
  function activate(shift: boolean) {
    if (shift) onTogglePurchased()
    else onToggleRemoved()
  }

  const cardStyle = purchased
    ? 'border-green-600 bg-green-950/30 ring-1 ring-green-600/30'
    : removed
      ? 'border-gray-800 bg-gray-900/50 opacity-25'
      : 'border-gray-700 bg-gray-800/80 hover:border-gray-500 hover:bg-gray-800'

  const nameStyle = purchased
    ? 'text-green-400'
    : removed
      ? 'line-through text-gray-600'
      : 'text-white'

  const badge = purchased ? (
    <span className="text-xs text-green-600 font-mono leading-none">bought</span>
  ) : removed ? (
    <span className="text-xs text-gray-700 font-mono leading-none">out</span>
  ) : null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${team.name}${purchased ? ', marked bought' : removed ? ', removed' : ''}`}
      onClick={(e) => activate(e.shiftKey)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') activate(e.shiftKey) }}
      className={`rounded-lg border px-3 py-2 flex flex-col gap-1 select-none cursor-pointer transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-500 ${cardStyle}`}
    >
      <span className={`text-sm font-medium leading-tight ${nameStyle}`}>
        {team.name}
      </span>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 font-mono">{team.weight}</span>
        {badge}
      </div>
    </div>
  )
}
