
import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

# Project paths
BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = BASE_DIR / "datasets" / "crop" / "Crop_recommendation.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "crop_recommendation.joblib"

# Expected columns
FEATURES = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall"
]

TARGET = "label"

# 1. Load dataset
print("\nLoading Crop Recommendation dataset...")

df = pd.read_csv(DATA_PATH)
df.columns = df.columns.str.strip()

# 2. Verify columns
required_columns = FEATURES + [TARGET]

missing = [
    col for col in required_columns
    if col not in df.columns
]

if missing:
    raise ValueError(f"Missing columns: {missing}")

print("All required columns found!")

# 3. Clean data
df = df[required_columns].copy()

for col in FEATURES:
    df[col] = pd.to_numeric(df[col], errors="coerce")

df[TARGET] = df[TARGET].astype("string").str.strip()

df = df.dropna(subset=[TARGET])
df = df[df[TARGET] != ""]

df = df.drop_duplicates()

if df[TARGET].nunique() < 2:
    raise ValueError("Dataset needs at least two crop classes.")

if df[FEATURES].isna().all(axis=1).any():
    df = df.dropna(subset=FEATURES, how="all")

print("\nDataset verification:")
print("Rows:", len(df))
print("Columns:", len(df.columns))
print("Crop classes:", df[TARGET].nunique())
print("Missing values:")
print(df.isnull().sum())

# 4. Separate inputs and output
X = df[FEATURES]
y = df[TARGET]

# 5. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# 6. Create ML pipeline
model = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("classifier", RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    ))
])

# 7. Train
print("\nTraining Crop Recommendation model...")

model.fit(X_train, y_train)

# 8. Evaluate
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\nTraining completed!")
print("Test accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification report:")
print(classification_report(y_test, predictions))

# 9. Save trained model
MODEL_DIR.mkdir(parents=True, exist_ok=True)

joblib.dump(model, MODEL_PATH)

print("\nModel saved successfully!")
print("Location:", MODEL_PATH)
