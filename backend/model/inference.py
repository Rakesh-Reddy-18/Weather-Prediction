"""
Model inference module — loaded once at startup, reused per request.
"""

import os
import joblib
import numpy as np
from pathlib import Path

MODEL_DIR = Path(__file__).parent
FEATURE_ORDER = ["humidity", "pressure", "wind_speed", "cloud_cover", "dew_point"]

_temp_model = None
_rain_model = None


def _load_models():
    global _temp_model, _rain_model
    if _temp_model is None:
        _temp_model = joblib.load(MODEL_DIR / "temp_model.pkl")
    if _rain_model is None:
        _rain_model = joblib.load(MODEL_DIR / "rain_model.pkl")


def predict(features: dict) -> dict:
    """
    features: dict with keys matching FEATURE_ORDER
    Returns: {temperature: float, rain_probability: float, will_rain: bool}
    """
    _load_models()

    X = np.array([[features[f] for f in FEATURE_ORDER]])

    temperature = round(float(_temp_model.predict(X)[0]), 2)
    rain_proba = float(_rain_model.predict_proba(X)[0][1])
    will_rain = bool(rain_proba >= 0.5)

    # Derived comfort index (heat index approximation)
    h = features["humidity"]
    t = temperature
    feels_like = round(
        t + 0.33 * (h / 100 * 6.105 * np.exp(17.27 * t / (237.7 + t))) - 4.0, 2
    )

    return {
        "temperature": temperature,
        "feels_like": feels_like,
        "rain_probability": round(rain_proba * 100, 1),
        "will_rain": will_rain,
        "condition": _condition_label(temperature, rain_proba, features["cloud_cover"]),
    }


def _condition_label(temp: float, rain_prob: float, cloud_cover: float) -> str:
    if rain_prob >= 0.7:
        return "Heavy Rain" if temp > 10 else "Sleet / Snow Mix"
    if rain_prob >= 0.4:
        return "Light Rain"
    if cloud_cover > 70:
        return "Overcast"
    if cloud_cover > 40:
        return "Partly Cloudy"
    if temp > 30:
        return "Hot & Sunny"
    if temp > 18:
        return "Clear"
    if temp > 5:
        return "Cool & Clear"
    return "Cold"
