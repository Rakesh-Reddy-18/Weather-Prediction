import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * @param {Object} features
 * @param {number} features.humidity       - % (0–100)
 * @param {number} features.pressure       - hPa (870–1085)
 * @param {number} features.wind_speed     - km/h (0–200)
 * @param {number} features.cloud_cover    - % (0–100)
 * @param {number} features.dew_point      - °C (-50–50)
 * @returns {Promise<PredictionResult>}
 */
export async function predictWeather(features) {
  const { data } = await client.post('/predict', features)
  return data
}

export async function checkHealth() {
  const { data } = await client.get('/health')
  return data
}

/**
 * @typedef {Object} PredictionResult
 * @property {number} temperature       - °C
 * @property {number} feels_like        - °C
 * @property {number} rain_probability  - 0–100
 * @property {boolean} will_rain
 * @property {string} condition
 * @property {Object} inputs
 */
