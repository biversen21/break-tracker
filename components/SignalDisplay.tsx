import type { SignalType } from '@/lib/types'

const SIGNAL_CONFIG: Record<SignalType, {
  emoji: string
  label: string
  textColor: string
  bgColor: string
  borderColor: string
}> = {
  STRONG_BUY: {
    emoji: '🔥',
    label: 'Strong Buy Zone',
    textColor: 'text-orange-300',
    bgColor: 'bg-orange-950/40',
    borderColor: 'border-orange-800/60',
  },
  VALUE: {
    emoji: '🟢',
    label: 'Value',
    textColor: 'text-green-300',
    bgColor: 'bg-green-950/40',
    borderColor: 'border-green-800/60',
  },
  FAIR: {
    emoji: '🟡',
    label: 'Fair',
    textColor: 'text-yellow-300',
    bgColor: 'bg-yellow-950/30',
    borderColor: 'border-yellow-800/50',
  },
  OVERPRICED: {
    emoji: '🔴',
    label: 'Overpriced',
    textColor: 'text-red-300',
    bgColor: 'bg-red-950/40',
    borderColor: 'border-red-800/60',
  },
}

type Props = {
  signal: SignalType
  fairValue: number
  edge: number | null
  remainingSpots: number
}

export default function SignalDisplay({ signal, fairValue, edge, remainingSpots }: Props) {
  const config = SIGNAL_CONFIG[signal]

  const aggressive = fairValue * 1.05
  const balanced   = fairValue * 0.95
  const conservative = fairValue * 0.85

  const showRanges = fairValue > 0

  return (
    <div className={`w-full rounded-xl border px-6 py-6 flex flex-col items-center gap-3 ${config.bgColor} ${config.borderColor}`}>
      {/* Primary signal */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-6xl leading-none">{config.emoji}</span>
        <span className={`text-4xl font-bold tracking-tight ${config.textColor}`}>
          {config.label}
        </span>
      </div>

      {/* Secondary numbers */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-mono text-gray-500">
        <span>Fair value: <span className="text-gray-400">${fairValue.toFixed(2)}</span></span>
        {edge !== null && (
          <span>
            Edge:{' '}
            <span className={edge >= 0 ? 'text-green-400' : 'text-red-400'}>
              {edge >= 0 ? '+' : ''}{edge.toFixed(2)}
            </span>
          </span>
        )}
        <span className="text-gray-600">{remainingSpots} spots left</span>
      </div>

      {/* Target buy ranges */}
      {showRanges && (
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-mono text-gray-600 pt-1 border-t border-white/5 w-full">
          <span>Conservative: <span className="text-gray-500">${conservative.toFixed(2)}</span></span>
          <span>Balanced: <span className="text-gray-500">${balanced.toFixed(2)}</span></span>
          <span>Aggressive: <span className="text-gray-500">${aggressive.toFixed(2)}</span></span>
        </div>
      )}
    </div>
  )
}
