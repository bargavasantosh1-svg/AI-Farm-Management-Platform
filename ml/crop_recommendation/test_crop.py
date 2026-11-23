
import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "models" / "crop_recommendation.joblib"

model = joblib.load(MODEL_PATH)

sample = pd.DataFrame([{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.8,
    "humidity": 82,
    "ph": 6.5,
    "rainfall": 202.9
}])

prediction = model.predict(sample)

print("\nCrop Recommendation Result")
print("--------------------------")
print("Recommended crop:", prediction[0])
