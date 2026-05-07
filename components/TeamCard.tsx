import type { Team } from '@/lib/types'

type Props = {
  team: Team
  removed: boolean
  purchased: boolean
  onToggleRemoved: () => void
  onTogglePurchased: () => void
}

export default function TeamCard({ team, removed, purchased, onToggleRemoved, onTogglePurchased }: Props) {
  function handleClick(e: React.MouseEvent) {
    if (e.shiftKey) {
      onTogglePurchased()
    } else {
      onToggleRemoved()
    }
  }

  const cardStyle = purchased
    ? 'border-green-500 bg-gray-800 ring-1 ring-green-500/40 cursor-pointer'
    : removed
      ? 'border-gray-800 bg-gray-900 opacity-30 cursor-pointer'
      : 'border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-500'

  const nameStyle = purchased
    ? 'text-green-400 font-medium'
    : removed
      ? 'line-through text-gray-500'
      : 'text-white'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e as never) }}
      className={`rounded-lg border px-3 py-2 flex flex-col gap-0.5 select-none transition-opacity ${cardStyle}`}
    >
      <span className={`text-sm font-medium leading-tight ${nameStyle}`}>
        {team.name}
      </span>
      <span className="text-xs text-gray-600 font-mono">{team.weight}</span>
    </div>
  )
}
