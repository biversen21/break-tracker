import type { SignalType } from '@/lib/types'

const SIGNAL_CONFIG: Record<SignalType, { emoji: string; label: string; color: string }> = {
  STRONG_BUY: { emoji: '🔥', label: 'Strong Buy Zone', color: 'text-orange-400' },
  VALUE:      { emoji: '🟢', label: 'Value',           color: 'text-green-400'  },
  FAIR:       { emoji: '🟡', label: 'Fair',            color: 'text-yellow-400' },
  OVERPRICED: { emoji: '🔴', label: 'Overpriced',      color: 'text-red-400'    },
}

type Props = {
  signal: SignalType
  fairValue: number
  edge: number | null
}

export default function SignalDisplay({ signal, fairValue, edge }: Props) {
  const config = SIGNAL_CONFIG[signal]

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      <span className="text-7xl leading-none">{config.emoji}</span>
      <span className={`text-3xl font-bold tracking-tight ${config.color}`}>
        {config.label}
      </span>
      <div className="flex gap-6 mt-2 text-sm text-gray-500 font-mono">
        <span>Fair value: ${fairValue.toFixed(2)}</span>
        {edge !== null && (
          <span>Edge: {edge >= 0 ? '+' : ''}{edge.toFixed(2)}</span>
        )}
      </div>
    </div>
  )
}
