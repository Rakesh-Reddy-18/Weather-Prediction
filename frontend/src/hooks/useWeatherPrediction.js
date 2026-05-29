import { useState, useCallback } from 'react'
import { predictWeather } from '../services/weatherApi'

const DEFAULT_FEATURES = {
  humidity: 65,
  pressure: 1013,
  wind_speed: 15,
  cloud_cover: 40,
  dew_point: 12,
}

export function useWeatherPrediction() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateFeature = useCallback((key, value) => {
    setFeatures(prev => ({ ...prev, [key]: Number(value) }))
  }, [])

  const runPrediction = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await predictWeather(features)
      setResult(data)
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Prediction failed. Is the backend running?'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [features])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setFeatures(DEFAULT_FEATURES)
  }, [])

  return { features, result, loading, error, updateFeature, runPrediction, reset }
}
