export function MetricSlider({ label, unit, name, value, min, max, step = 1, icon, onChange }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-display text-ice-400/70 uppercase tracking-widest">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(name, e.target.value)}
            className="w-20 bg-transparent text-right font-display text-rain text-sm
                       border border-rain/20 rounded px-2 py-0.5
                       focus:outline-none focus:border-rain/60 transition-colors"
          />
          <span className="text-xs text-ice-400/50 font-body w-8">{unit}</span>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className="w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(56,189,248,0.7) ${pct}%, rgba(125,211,252,0.12) ${pct}%)`,
          }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-ice-400/30 font-body">{min}{unit}</span>
        <span className="text-xs text-ice-400/30 font-body">{max}{unit}</span>
      </div>
    </div>
  )
}
