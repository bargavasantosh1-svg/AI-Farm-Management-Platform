
import pandas as pd
import joblib
from pathlib import Path

# Project paths
ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = ROOT / "datasets" / "soil" / "soil_health_recommendation_sample.csv"
MODEL_PATH = ROOT / "models" / "soil_model.pkl"
FEATURE_PATH = ROOT / "models" / "soil_features.pkl"

# Load trained model
model = joblib.load(MODEL_PATH)
features = joblib.load(FEATURE_PATH)

# Load dataset for a sample prediction
data = pd.read_csv(DATASET_PATH)

# Take one sample from the dataset
sample = data.drop(columns=["Soil_Health_Recommendation"]).iloc[[0]]

# Prepare input
input_data = pd.get_dummies(sample)
input_data = input_data.reindex(columns=features, fill_value=0)

# Make prediction
prediction = model.predict(input_data)

print("\n========== SOIL PREDICTION TEST ==========")

print("\nInput Soil Details:")
print(sample.to_string(index=False))

print("\nPredicted Soil Recommendation:")
print(prediction[0])

print("\nActual Dataset Recommendation:")
print(data["Soil_Health_Recommendation"].iloc[0])

print("\nPrediction Confidence:")

if hasattr(model, "predict_proba"):
    probabilities = model.predict_proba(input_data)[0]

    for label, probability in zip(model.classes_, probabilities):
        print(f"{label}: {probability * 100:.2f}%")

print("\n========== TEST COMPLETED ==========")
