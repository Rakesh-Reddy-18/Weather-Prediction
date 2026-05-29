"""
Synthetic Weather Data Generator + Model Trainer
Generates realistic weather data and trains a multi-output regression model.
Outputs: temperature (°C) + rain probability (0–1)
Features: humidity (%), pressure (hPa), wind_speed (km/h), cloud_cover (%), dew_point (°C)
"""

import numpy as np
import pandas as pd
import joblib
import os
from sklearn.ensemble import GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, accuracy_score

SEED = 42
N_SAMPLES = 10_000
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))


def generate_weather_data(n: int = N_SAMPLES, seed: int = SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    # Simulate seasonal variation (0–365 days)
    day_of_year = rng.uniform(0, 365, n)
    season_factor = np.sin(2 * np.pi * day_of_year / 365)  # -1 to 1

    # Base atmospheric conditions
    pressure = rng.normal(1013.25, 10, n).clip(970, 1050)          # hPa
    humidity = (60 + 20 * (-season_factor) + rng.normal(0, 10, n)).clip(10, 100)  # %
    wind_speed = rng.gamma(2, 8, n).clip(0, 80)                    # km/h
    cloud_cover = (humidity * 0.6 + rng.normal(0, 15, n)).clip(0, 100)  # %

    # Dew point: physically linked to humidity & temp
    base_temp = 15 + 12 * season_factor + rng.normal(0, 3, n)
    dew_point = base_temp - ((100 - humidity) / 5) + rng.normal(0, 1, n)

    # Target: temperature (physics-inspired)
    temperature = (
        base_temp
        - 0.01 * (pressure - 1013)     # high pressure → warmer
        + 0.05 * (100 - humidity)       # dry air warms faster
        - 0.05 * wind_speed             # wind chill
        - 0.02 * cloud_cover            # cloud insulation (minor)
        + rng.normal(0, 1.5, n)
    )

    # Target: rain probability (logistic-inspired)
    rain_score = (
        0.04 * humidity
        - 0.008 * (pressure - 1013)
        + 0.01 * cloud_cover
        - 0.005 * wind_speed
        + rng.normal(0, 0.5, n)
    )
    rain_prob_true = 1 / (1 + np.exp(-rain_score + 1.5))
    will_rain = (rng.uniform(0, 1, n) < rain_prob_true).astype(int)

    return pd.DataFrame({
        "humidity": humidity,
        "pressure": pressure,
        "wind_speed": wind_speed,
        "cloud_cover": cloud_cover,
        "dew_point": dew_point,
        "temperature": temperature,
        "will_rain": will_rain,
    })


FEATURE_COLS = ["humidity", "pressure", "wind_speed", "cloud_cover", "dew_point"]


def train(df: pd.DataFrame):
    X = df[FEATURE_COLS].values
    y_temp = df["temperature"].values
    y_rain = df["will_rain"].values

    X_train, X_test, yt_train, yt_test, yr_train, yr_test = train_test_split(
        X, y_temp, y_rain, test_size=0.2, random_state=SEED
    )

    # Temperature regression pipeline
    temp_pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", GradientBoostingRegressor(
            n_estimators=200, max_depth=4, learning_rate=0.05,
            subsample=0.8, random_state=SEED
        ))
    ])
    temp_pipeline.fit(X_train, yt_train)
    temp_mae = mean_absolute_error(yt_test, temp_pipeline.predict(X_test))
    print(f"[Temperature] MAE: {temp_mae:.2f} °C")

    # Rain classification pipeline
    rain_pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("model", GradientBoostingClassifier(
            n_estimators=200, max_depth=4, learning_rate=0.05,
            subsample=0.8, random_state=SEED
        ))
    ])
    rain_pipeline.fit(X_train, yr_train)
    rain_acc = accuracy_score(yr_test, rain_pipeline.predict(X_test))
    print(f"[Rain]        Accuracy: {rain_acc:.3f}")

    return temp_pipeline, rain_pipeline


def save_models(temp_pipeline, rain_pipeline):
    joblib.dump(temp_pipeline, os.path.join(MODEL_DIR, "temp_model.pkl"))
    joblib.dump(rain_pipeline, os.path.join(MODEL_DIR, "rain_model.pkl"))
    print(f"Models saved to {MODEL_DIR}/")


if __name__ == "__main__":
    print("Generating synthetic weather data...")
    df = generate_weather_data()
    print(f"Dataset: {len(df)} rows, {df[FEATURE_COLS].isnull().sum().sum()} nulls")

    print("\nTraining models...")
    temp_model, rain_model = train(df)

    save_models(temp_model, rain_model)
    print("\nDone. Run the API server next.")
