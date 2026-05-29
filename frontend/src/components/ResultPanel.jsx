function ConditionIcon({ condition }) {
  const icons = {
    'Heavy Rain': '⛈️',
    'Sleet / Snow Mix': '🌨️',
    'Light Rain': '🌧️',
    'Overcast': '☁️',
    'Partly Cloudy': '⛅',
    'Hot & Sunny': '☀️',
    'Clear': '🌤️',
    'Cool & Clear': '🍃',
    'Cold': '❄️',
  }
  return <span className="text-5xl animate-float">{icons[condition] ?? '🌡️'}</span>
}

function StatTile({ label, value, unit, highlight }) {
  return (
    <div className={`glass rounded-xl p-4 flex flex-col gap-1 ${highlight ? 'border-rain/30' : ''}`}>
      <span className="text-xs font-display text-ice-400/50 uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-1">
        <span className={`font-display text-2xl font-bold ${highlight ? 'text-rain' : 'text-ice-200'}`}>
          {value}
        </span>
        <span className="text-ice-400/60 text-sm mb-0.5 font-body">{unit}</span>
      </div>
    </div>
  )
}

function RainBar({ probability }) {
  const color = probability >= 70 ? '#f43f5e' : probability >= 40 ? '#fbbf24' : '#38bdf8'
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-display text-ice-400/50 uppercase tracking-widest">
          Rain Probability
        </span>
        <span className="font-display text-sm" style={{ color }}>
          {probability}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-storm-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${probability}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      <p className="text-xs text-ice-400/40 mt-1 font-body">
        {probability >= 70
          ? 'Rain is very likely — bring an umbrella.'
          : probability >= 40
          ? 'Some chance of rain — stay alert.'
          : 'Unlikely to rain.'}
      </p>
    </div>
  )
}

export function ResultPanel({ result }) {
  if (!result) return null

  return (
    <div className="animate-fade-up space-y-5">
      {/* Header */}
      <div className="glass rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-display text-ice-400/50 uppercase tracking-widest mb-1">
            Predicted Condition
          </p>
          <h2 className="font-display text-3xl text-ice-200 font-bold">
            {result.condition}
          </h2>
        </div>
        <ConditionIcon condition={result.condition} />
      </div>

      {/* Temperature tiles */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Temperature" value={result.temperature.toFixed(1)} unit="°C" highlight />
        <StatTile label="Feels Like" value={result.feels_like.toFixed(1)} unit="°C" />
      </div>

      {/* Rain bar */}
      <div className="glass rounded-2xl p-5">
        <RainBar probability={result.rain_probability} />
        <p className={`mt-3 font-display text-sm ${result.will_rain ? 'text-danger' : 'text-ice-400/60'}`}>
          {result.will_rain ? '🌧 Rain expected' : '✓ No rain expected'}
        </p>
      </div>

      {/* Input echo */}
      <details className="group">
        <summary className="text-xs font-display text-ice-400/30 uppercase tracking-widest cursor-pointer hover:text-ice-400/60 transition-colors select-none">
          Input features ↓
        </summary>
        <div className="mt-2 glass rounded-xl p-4 grid grid-cols-2 gap-2 text-xs font-display">
          {Object.entries(result.inputs).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 text-ice-400/50">
              <span className="uppercase tracking-wider">{k.replace('_', ' ')}</span>
              <span className="text-ice-300/70">{Number(v).toFixed(1)}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  )
}
