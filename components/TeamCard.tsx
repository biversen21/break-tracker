import type { Team } from '@/lib/types'

type Props = {
  team: Team
  removed?: boolean
}

export default function TeamCard({ team, removed = false }: Props) {
  return (
    <div
      className={`
        rounded-lg border px-3 py-2 flex flex-col gap-0.5 select-none
        ${removed
          ? 'border-gray-800 bg-gray-900 opacity-30'
          : 'border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-500'
        }
      `}
    >
      <span className={`text-sm font-medium leading-tight ${removed ? 'line-through text-gray-500' : 'text-white'}`}>
        {team.name}
      </span>
      <span className="text-xs text-gray-600 font-mono">{team.weight}</span>
    </div>
  )
}
