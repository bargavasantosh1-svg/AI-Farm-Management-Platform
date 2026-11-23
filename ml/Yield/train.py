
import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Project paths
ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = ROOT / "datasets" / "yield" / "crop_yield.csv"
MODEL_PATH = ROOT / "models" / "yield_model.pkl"

# Load dataset
print("\nLoading Crop Yield Dataset...")

data = pd.read_csv(DATASET_PATH)
data.columns = data.columns.str.strip()

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)
print("Columns:", data.columns.tolist())

# Target column
target = "Yield"

# Remove rows without target values
data[target] = pd.to_numeric(data[target], errors="coerce")
data = data.dropna(subset=[target])

# Input features (Production intentionally excluded)
categorical_features = ["Crop", "Season", "State"]
numeric_features = [
    "Crop_Year",
    "Area",
    "Annual_Rainfall",
    "Fertilizer",
    "Pesticide"
]

required_columns = categorical_features + numeric_features + [target]

missing_columns = [
    col for col in required_columns if col not in data.columns
]

if missing_columns:
    raise ValueError(f"Missing dataset columns: {missing_columns}")

X = data[categorical_features + numeric_features].copy()
y = data[target]

# Convert numerical columns
for col in numeric_features:
    X[col] = pd.to_numeric(X[col], errors="coerce")

# Preprocessing
categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median"))
])

preprocessor = ColumnTransformer(transformers=[
    ("categorical", categorical_transformer, categorical_features),
    ("numeric", numeric_transformer, numeric_features)
])

# Complete ML pipeline
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    ))
])

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# Train model
print("\nTraining Crop Yield Prediction Model...")

model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\n========== YIELD TRAINING RESULTS ==========")
print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))
print("Mean Absolute Error (MAE):", round(mae, 4))
print("Root Mean Squared Error (RMSE):", round(rmse, 4))
print("R2 Score:", round(r2, 4))
print("R2 Percentage:", round(r2 * 100, 2), "%")

# Save trained model
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL_PATH)

print("\n============================================")
print("YIELD MODEL TRAINED SUCCESSFULLY!")
print("Model saved:", MODEL_PATH)
print("============================================")
