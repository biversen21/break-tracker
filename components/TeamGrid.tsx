import type { Team } from '@/lib/types'
import TeamCard from './TeamCard'

type Props = {
  teams: Team[]
}

export default function TeamGrid({ teams }: Props) {
  return (
    <div className="w-full">
      <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Teams</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
