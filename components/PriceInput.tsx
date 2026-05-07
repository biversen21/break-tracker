type Props = {
  value: number | null
  onChange: (value: number | null) => void
}

export default function PriceInput({ value, onChange }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '' || raw === null) {
      onChange(null)
      return
    }
    const parsed = parseFloat(raw)
    if (isNaN(parsed)) return
    onChange(Math.max(0, parsed))
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs text-gray-500 uppercase tracking-widest">
        Current asking price
      </label>
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-lg">$</span>
        <input
          type="number"
          min={0}
          value={value ?? ''}
          onChange={handleChange}
          placeholder="0.00"
          className="w-36 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-xl text-center font-mono placeholder-gray-700 focus:outline-none focus:border-gray-500"
        />
      </div>
    </div>
  )
}
