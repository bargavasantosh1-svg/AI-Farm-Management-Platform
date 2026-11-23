
import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# 1. Load dataset
dataset_path = "datasets/market/india_market_prediction_sample.csv"

df = pd.read_csv(dataset_path)

print("Market dataset loaded successfully!")
print("Dataset shape:", df.shape)

# 2. Prepare month feature
df["Month"] = pd.to_datetime(df["Month"])
df["Month_Number"] = (
    df["Month"].dt.year * 12 + df["Month"].dt.month
)

# 3. Select input and target
X = df[
    [
        "State",
        "Month_Number",
        "Commodity",
        "Variety",
        "Arrivals_Tonnes"
    ]
]

y = df["Modal_Price_Rs_per_Quintal"]

# 4. Sort data chronologically
df = df.sort_values("Month").reset_index(drop=True)

X = df[
    [
        "State",
        "Month_Number",
        "Commodity",
        "Variety",
        "Arrivals_Tonnes"
    ]
]

y = df["Modal_Price_Rs_per_Quintal"]

# 5. Chronological train-test split
unique_months = sorted(df["Month"].unique())

if len(unique_months) < 2:
    raise ValueError("At least two different months are required.")

split_month = unique_months[-1]

train_mask = df["Month"] < split_month
test_mask = df["Month"] == split_month

X_train = X[train_mask]
X_test = X[test_mask]

y_train = y[train_mask]
y_test = y[test_mask]

print("Training records:", len(X_train))
print("Testing records:", len(X_test))

# 6. Preprocessing
categorical_columns = [
    "State",
    "Commodity",
    "Variety"
]

numerical_columns = [
    "Month_Number",
    "Arrivals_Tonnes"
]

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_columns
        )
    ],
    remainder="passthrough"
)

# 7. Create prediction model
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=100,
        random_state=42
    ))
])

# 8. Train model
print("\nTraining Market Prediction Model...")

model.fit(X_train, y_train)

# 9. Evaluate model
predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5
r2 = r2_score(y_test, predictions)

print("\nMarket Prediction Training Results")
print("----------------------------------")
print("MAE:", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2 Score:", round(r2, 2))

# 10. Save model
os.makedirs("models", exist_ok=True)

joblib.dump(
    model,
    "models/market_prediction.joblib"
)

print("\nMarket model saved successfully!")
print("Location: models/market_prediction.joblib")
