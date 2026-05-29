# WeatherML — Atmospheric Intelligence

ML-powered weather prediction using local Gradient Boosting models.  
**Stack**: Python · FastAPI · scikit-learn · Vite · React · Tailwind CSS  
**Deployment**: Render (backend) · Vercel (frontend)

---

## Directory Structure

```
weather-ml-app/
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   └── server.py          # FastAPI app + CORS + /predict endpoint
│   ├── model/
│   │   ├── __init__.py
│   │   ├── train_model.py     # Data generator + GBM trainer
│   │   └── inference.py       # Prediction logic (loaded at startup)
│   ├── requirements.txt
│   └── render.yaml            # Render deployment config
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx  # Main layout
    │   │   ├── MetricSlider.jsx
    │   │   ├── ResultPanel.jsx
    │   │   └── LoadingSkeleton.jsx
    │   ├── hooks/
    │   │   └── useWeatherPrediction.js
    │   ├── services/
    │   │   └── weatherApi.js  # axios client
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vercel.json
    └── .env.example
```

---

## Local Development

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Train the model (generates temp_model.pkl + rain_model.pkl)
python model/train_model.py

# Start API server
uvicorn api.server:app --reload --port 8000
# → http://localhost:8000/health
# → POST http://localhost:8000/predict
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: VITE_API_URL=http://localhost:8000
npm run dev
# → http://localhost:5173
```

---

## API Reference

### `POST /predict`

```json
// Request body
{
  "humidity": 75,
  "pressure": 1005,
  "wind_speed": 20,
  "cloud_cover": 60,
  "dew_point": 14
}

// Response
{
  "temperature": 18.42,
  "feels_like": 17.1,
  "rain_probability": 63.4,
  "will_rain": true,
  "condition": "Light Rain",
  "inputs": { ... }
}
```

### `GET /health`
Returns `{ "status": "ok", "model_features": [...] }`

---

## Deployment

### Render (Backend)

1. Push `backend/` to a GitHub repo.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Point to the repo; Render will detect `render.yaml` automatically.
4. Set the `ALLOWED_ORIGINS` environment variable to your Vercel URL:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
5. The build command trains the model before server start — no pre-built artifacts needed.

### Vercel (Frontend)

1. Push `frontend/` to a GitHub repo (or monorepo with root set to `frontend/`).
2. Import the project at [vercel.com](https://vercel.com).
3. Set the environment variable:
   ```
   VITE_API_URL=https://your-render-service.onrender.com
   ```
4. Deploy. Vercel auto-detects Vite.

### Environment Variables Summary

| Service | Variable | Example Value |
|---------|----------|---------------|
| Render  | `ALLOWED_ORIGINS` | `https://weather-ml.vercel.app` |
| Vercel  | `VITE_API_URL` | `https://weather-ml-api.onrender.com` |

---

## ML Model Details

| Target | Model | Metric |
|--------|-------|--------|
| Temperature (°C) | `GradientBoostingRegressor` (200 trees, depth 4) | MAE ~1.5°C |
| Rain (binary) | `GradientBoostingClassifier` (200 trees, depth 4) | Accuracy ~85% |

Features: `humidity`, `pressure`, `wind_speed`, `cloud_cover`, `dew_point`  
Training data: 10,000 synthetic samples with physics-inspired correlations.
