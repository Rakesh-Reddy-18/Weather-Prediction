"""
FastAPI Weather Prediction API
POST /predict  — returns temperature + rain prediction
GET  /health   — liveness probe for Render
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from contextlib import asynccontextmanager
import sys
from pathlib import Path

# Ensure backend root (parent of api/) is on sys.path so `model` package resolves
BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from model.inference import predict, FEATURE_ORDER, _load_models

# ---------------------------------------------------------------------------
# App & CORS
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Pre-load models at startup so the first request isn't slow."""
    try:
        _load_models()
        print("✓ ML models loaded successfully.")
    except FileNotFoundError:
        print(
            "✗ Model .pkl files not found.\n"
            f"  Expected in: {BACKEND_ROOT / 'model'}\n"
            "  Run: python model/train_model.py"
        )
    yield  # server runs here


app = FastAPI(
    title="Weather Prediction API",
    version="1.0.0",
    description="ML-powered weather prediction using local GBM models.",
    lifespan=lifespan,
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:4173",   # dev defaults
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

class WeatherFeatures(BaseModel):
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity (%)")
    pressure: float = Field(..., ge=870, le=1085, description="Atmospheric pressure (hPa)")
    wind_speed: float = Field(..., ge=0, le=200, description="Wind speed (km/h)")
    cloud_cover: float = Field(..., ge=0, le=100, description="Cloud cover (%)")
    dew_point: float = Field(..., ge=-50, le=50, description="Dew point temperature (°C)")

    @field_validator("humidity", "cloud_cover")
    @classmethod
    def check_percentage(cls, v):
        return round(v, 2)


class PredictionResponse(BaseModel):
    temperature: float
    feels_like: float
    rain_probability: float
    will_rain: bool
    condition: str
    inputs: dict


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok", "model_features": FEATURE_ORDER}


@app.post("/predict", response_model=PredictionResponse)
def predict_weather(features: WeatherFeatures):
    try:
        result = predict(features.model_dump())
        return PredictionResponse(**result, inputs=features.model_dump())
    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Models not found. Run `python model/train_model.py` first.",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/predict")
def predict_get(
    humidity: float,
    pressure: float,
    wind_speed: float,
    cloud_cover: float,
    dew_point: float,
):
    """GET convenience endpoint for quick testing."""
    features = WeatherFeatures(
        humidity=humidity,
        pressure=pressure,
        wind_speed=wind_speed,
        cloud_cover=cloud_cover,
        dew_point=dew_point,
    )
    return predict_weather(features)
