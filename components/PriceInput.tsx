type Props = {
  value: number | null
  onChange: (value: number | null) => void
}

export default function PriceInput({ value, onChange }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') {
      onChange(null)
      return
    }
    const parsed = parseFloat(raw)
    if (isNaN(parsed)) return
    onChange(Math.max(0, parsed))
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <label className="text-xs text-gray-500 uppercase tracking-widest">
        Asking price
      </label>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xl font-mono">$</span>
        <input
          type="number"
          min={0}
          value={value ?? ''}
          onChange={handleChange}
          placeholder="0.00"
          className="w-44 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-2xl text-center font-mono placeholder-gray-700 focus:outline-none focus:border-gray-500"
        />
        {value !== null && (
          <button
            onClick={() => onChange(null)}
            className="text-gray-600 hover:text-gray-400 text-lg px-1 leading-none"
            aria-label="Clear price"
          >
            ×
          </button>
        )}
      </div>
      {value === null && (
        <p className="text-xs text-gray-700">Enter price to see signal</p>
      )}
    </div>
  )
}
