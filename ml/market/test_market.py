
import pandas as pd
import joblib

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

# 1. Load dataset
dataset_path = "datasets/market/india_market_prediction_sample.csv"

df = pd.read_csv(dataset_path)

df["Month"] = pd.to_datetime(df["Month"])

df["Month_Number"] = (
    df["Month"].dt.year * 12 + df["Month"].dt.month
)

# 2. Prepare input and output
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

# 3. Chronological split
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

split_month = df["Month"].max()

train_mask = df["Month"] < split_month
test_mask = df["Month"] == split_month

X_test = X[test_mask]
y_test = y[test_mask]

# 4. Load trained model
model = joblib.load("models/market_prediction.joblib")

print("Market model loaded successfully!")

# 5. Make predictions
predictions = model.predict(X_test)

# 6. Calculate evaluation metrics
mae = mean_absolute_error(y_test, predictions)

rmse = mean_squared_error(
    y_test, predictions
) ** 0.5

r2 = r2_score(y_test, predictions)

# 7. Display results
print("\nMarket Prediction Test Results")
print("--------------------------------")
print("Testing Records:", len(X_test))
print("MAE:", round(mae, 2))
print("RMSE:", round(rmse, 2))
print("R2 Score:", round(r2, 2))

# 8. Display sample predictions
print("\nSample Market Price Predictions")
print("--------------------------------")

for i in range(min(5, len(X_test))):
    print("\nState:", X_test.iloc[i]["State"])
    print("Commodity:", X_test.iloc[i]["Commodity"])
    print("Actual Price:", round(y_test.iloc[i], 2))
    print("Predicted Price:", round(predictions[i], 2))

print("\nMarket prediction testing completed!")
