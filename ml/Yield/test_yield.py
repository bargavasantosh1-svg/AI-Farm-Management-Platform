
import pandas as pd
import joblib

from pathlib import Path
from sklearn.metrics import mean_absolute_error

# Project paths
ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = ROOT / "datasets" / "yield" / "crop_yield.csv"
MODEL_PATH = ROOT / "models" / "yield_model.pkl"

# Load trained model
print("\nLoading Yield Prediction Model...")

model = joblib.load(MODEL_PATH)
data = pd.read_csv(DATASET_PATH)

data.columns = data.columns.str.strip()

# Select one sample for testing
sample = data.dropna(subset=["Yield"]).iloc[[0]]

# Prepare input features
categorical_features = ["Crop", "Season", "State"]

numeric_features = [
    "Crop_Year",
    "Area",
    "Annual_Rainfall",
    "Fertilizer",
    "Pesticide"
]

input_data = sample[
    categorical_features + numeric_features
].copy()

for col in numeric_features:
    input_data[col] = pd.to_numeric(
        input_data[col], errors="coerce"
    )

# Predict crop yield
prediction = model.predict(input_data)

actual_yield = float(sample["Yield"].iloc[0])
predicted_yield = float(prediction[0])

print("\n========== YIELD PREDICTION TEST ==========")

print("\nInput Crop Details:")
print(input_data.to_string(index=False))

print("\nPredicted Crop Yield:", round(predicted_yield, 4))
print("Actual Dataset Yield:", round(actual_yield, 4))

print(
    "Absolute Difference:",
    round(abs(predicted_yield - actual_yield), 4)
)

print("\n========== TEST COMPLETED ==========")
