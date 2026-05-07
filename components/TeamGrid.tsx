import type { Team } from '@/lib/types'
import TeamCard from './TeamCard'

type Props = {
  teams: Team[]
  removedTeamIds: Set<string>
  purchasedTeamIds: Set<string>
  onToggleRemovedTeam: (teamId: string) => void
  onTogglePurchasedTeam: (teamId: string) => void
}

export default function TeamGrid({ teams, removedTeamIds, purchasedTeamIds, onToggleRemovedTeam, onTogglePurchasedTeam }: Props) {
  const remaining = teams.length - removedTeamIds.size
  const removed = removedTeamIds.size
  const purchased = purchasedTeamIds.size

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-3 text-xs font-mono text-gray-600">
        <span><span className="text-gray-400">{remaining}</span> remaining</span>
        {removed > 0 && <span><span className="text-gray-500">{removed}</span> out</span>}
        {purchased > 0 && <span><span className="text-green-700">{purchased}</span> bought</span>}
        <span className="ml-auto text-gray-800">click · ⇧click bought</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            removed={removedTeamIds.has(team.id)}
            purchased={purchasedTeamIds.has(team.id)}
            onToggleRemoved={() => onToggleRemovedTeam(team.id)}
            onTogglePurchased={() => onTogglePurchasedTeam(team.id)}
          />
        ))}
      </div>
    </div>
  )
}
