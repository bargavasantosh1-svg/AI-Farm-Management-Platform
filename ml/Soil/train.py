
import pandas as pd
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Project paths
ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = ROOT / "datasets" / "soil" / "soil_health_recommendation_sample.csv"
MODEL_PATH = ROOT / "models" / "soil_model.pkl"
FEATURE_PATH = ROOT / "models" / "soil_features.pkl"

# Load dataset
print("\nLoading Soil Dataset...")
data = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)

# Target column
target = "Soil_Health_Recommendation"

# Separate features and target
X = data.drop(columns=[target])
y = data[target]

# Convert categorical features if present
X = pd.get_dummies(X)

# Split dataset
stratify_option = y if y.value_counts().min() >= 2 else None

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=stratify_option
)

# Train Random Forest model
print("\nTraining Soil Prediction Model...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n========== TRAINING RESULTS ==========")
print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))
print("Model Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_test, predictions, zero_division=0))

# Save model
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

joblib.dump(model, MODEL_PATH)
joblib.dump(X.columns.tolist(), FEATURE_PATH)

print("\n======================================")
print("MODEL TRAINED SUCCESSFULLY!")
print("Model saved:", MODEL_PATH)
print("Features saved:", FEATURE_PATH)
print("======================================")
