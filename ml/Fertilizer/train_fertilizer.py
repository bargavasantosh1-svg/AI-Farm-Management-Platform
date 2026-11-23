
import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. Load dataset
dataset_path = "datasets/fertilizer/fertilizer_recommendation.csv"

df = pd.read_csv(dataset_path)

print("Dataset loaded successfully!")
print("Dataset shape:", df.shape)

# 2. Separate input and output
X = df.drop("Fertilizer Name", axis=1)
y = df["Fertilizer Name"]

# 3. Identify categorical and numerical columns
categorical_columns = ["Soil Type", "Crop Type"]

numerical_columns = [
    "Temparature",
    "Humidity",
    "Moisture",
    "Nitrogen",
    "Potassium",
    "Phosphorous"
]

# 4. Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("categorical", OneHotEncoder(handle_unknown="ignore"),
         categorical_columns)
    ],
    remainder="passthrough"
)

# 5. Create model pipeline
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=100,
        random_state=42
    ))
])

# 6. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 7. Train model
print("\nTraining Fertilizer Recommendation Model...")

model.fit(X_train, y_train)

# 8. Evaluate model
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\nFertilizer Model Training Results")
print("----------------------------------")
print("Accuracy:", round(accuracy * 100, 2), "%")
print("\nClassification Report:")
print(classification_report(y_test, predictions, zero_division=0))

# 9. Save trained model
os.makedirs("models", exist_ok=True)

joblib.dump(
    model,
    "models/fertilizer_recommendation.joblib"
)

print("\nModel saved successfully!")
print("Location: models/fertilizer_recommendation.joblib")
