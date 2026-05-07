type Props = {
  onReset: () => void
  disabled?: boolean
}

export default function ResetButton({ onReset, disabled = false }: Props) {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className="px-3 py-1.5 rounded-md text-xs font-medium border border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      Reset break
    </button>
  )
}
