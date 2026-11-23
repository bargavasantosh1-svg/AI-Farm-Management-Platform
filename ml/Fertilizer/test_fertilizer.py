
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 1. Load dataset
dataset_path = "datasets/fertilizer/fertilizer_recommendation.csv"
df = pd.read_csv(dataset_path)

# 2. Separate input and output
X = df.drop("Fertilizer Name", axis=1)
y = df["Fertilizer Name"]

# 3. Split dataset (same split used during training)
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 4. Load trained model
model = joblib.load("models/fertilizer_recommendation.joblib")

print("Fertilizer model loaded successfully!")

# 5. Make predictions
predictions = model.predict(X_test)

# 6. Calculate accuracy
accuracy = accuracy_score(y_test, predictions)

print("\nFertilizer Recommendation Test Results")
print("---------------------------------------")
print("Test Accuracy:", round(accuracy * 100, 2), "%")

# 7. Classification report
print("\nClassification Report:")
print(classification_report(y_test, predictions, zero_division=0))

# 8. Confusion matrix
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))

# 9. Display sample predictions
print("\nSample Fertilizer Predictions")
print("-----------------------------")

for i in range(min(5, len(X_test))):
    print("\nActual Fertilizer:", y_test.iloc[i])
    print("Predicted Fertilizer:", predictions[i])

print("\nFertilizer testing completed!")
