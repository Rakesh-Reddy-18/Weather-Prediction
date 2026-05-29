import { MetricSlider } from './MetricSlider'
import { ResultPanel } from './ResultPanel'
import { LoadingSkeleton } from './LoadingSkeleton'
import { useWeatherPrediction } from '../hooks/useWeatherPrediction'

const METRICS = [
  { name: 'humidity',    label: 'Humidity',     unit: '%',   min: 0,    max: 100,  step: 1,   icon: '💧' },
  { name: 'pressure',   label: 'Pressure',     unit: 'hPa', min: 950,  max: 1050, step: 0.5, icon: '🌀' },
  { name: 'wind_speed', label: 'Wind Speed',   unit: 'km/h',min: 0,    max: 100,  step: 1,   icon: '🌬️' },
  { name: 'cloud_cover',label: 'Cloud Cover',  unit: '%',   min: 0,    max: 100,  step: 1,   icon: '☁️' },
  { name: 'dew_point',  label: 'Dew Point',    unit: '°C',  min: -20,  max: 35,   step: 0.5, icon: '🌡️' },
]

export function Dashboard() {
  const { features, result, loading, error, updateFeature, runPrediction, reset } =
    useWeatherPrediction()

  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 10%, rgba(56,189,248,0.07) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 40% 30% at 80% 80%, rgba(56,89,248,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-ice-400/5 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-ice-300 tracking-tight">
            ⚡ WeatherML
          </h1>
          <p className="text-xs text-ice-400/40 font-body mt-0.5">
            Gradient Boosting · Local Inference
          </p>
        </div>
        <span className="text-xs font-display text-rain/60 border border-rain/20 px-3 py-1 rounded-full">
          GBM v1.0
        </span>
      </header>

      {/* Main layout */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8">

          {/* LEFT — Input panel */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-ice-200 mb-1">
                Atmospheric Inputs
              </h2>
              <p className="text-sm text-ice-400/50 font-body">
                Adjust the parameters and run the model to get a prediction.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-7">
              {METRICS.map(m => (
                <MetricSlider
                  key={m.name}
                  {...m}
                  value={features[m.name]}
                  onChange={updateFeature}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={runPrediction}
                disabled={loading}
                className="flex-1 font-display text-sm uppercase tracking-widest
                           bg-rain hover:bg-ice-400 text-storm-950
                           px-6 py-3 rounded-xl transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           shadow-[0_0_24px_rgba(56,189,248,0.25)]
                           hover:shadow-[0_0_32px_rgba(56,189,248,0.45)]
                           active:scale-95"
              >
                {loading ? 'Running...' : 'Run Prediction →'}
              </button>
              {(result || error) && (
                <button
                  onClick={reset}
                  className="font-display text-sm uppercase tracking-widest
                             border border-ice-400/20 text-ice-400/60 hover:text-ice-400
                             px-4 py-3 rounded-xl transition-all duration-200
                             hover:border-ice-400/40"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Results panel */}
          <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
            <div>
              <h2 className="font-display text-2xl text-ice-200 mb-1">
                Prediction Output
              </h2>
              <p className="text-sm text-ice-400/50 font-body">
                Model output for the given atmospheric state.
              </p>
            </div>

            {loading && <LoadingSkeleton />}

            {!loading && error && (
              <div className="glass rounded-2xl p-6 border border-danger/20 animate-fade-up">
                <p className="text-xs font-display text-danger/70 uppercase tracking-widest mb-2">
                  Error
                </p>
                <p className="text-sm font-body text-ice-300/70">{error}</p>
                <p className="text-xs text-ice-400/30 mt-3 font-body">
                  Make sure the backend is running and <code className="text-rain/60">VITE_API_URL</code> is set.
                </p>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[280px] border-dashed">
                <div className="text-5xl mb-4 opacity-30">🌐</div>
                <p className="text-sm text-ice-400/40 font-body">
                  Set your parameters and click <br />
                  <span className="font-display text-rain/60">Run Prediction</span>
                </p>
              </div>
            )}

            {!loading && !error && result && (
              <ResultPanel result={result} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-ice-400/5 px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-ice-400/20 font-body">
          Powered by scikit-learn GBM · FastAPI · React
        </span>
        <span className="text-xs font-display text-ice-400/20">
          WeatherML © 2024
        </span>
      </footer>
    </div>
  )
}
