
import os
import logging
from pathlib import Path
from threading import RLock

import joblib
import numpy as np

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

MODEL_FILES = {
    "crop": "crop_recommendation.joblib",
    "disease": "disease_detection.keras",
    "fertilizer": "fertilizer_recommendation.joblib",
    "market": "market_prediction.joblib",
    "soil": "soil_analysis.joblib",
    "yield": "yield_prediction.joblib",
}

models = {}
model_errors = {}
model_lock = RLock()


def load_model(name):
    if name not in MODEL_FILES:
        raise ValueError(f"Unknown model: {name}")

    filename = os.getenv(
        f"MODEL_{name.upper()}",
        MODEL_FILES[name]
    )

    path = MODEL_DIR / filename

    if not path.exists():
        raise FileNotFoundError(f"Missing model: {path}")

    extension = path.suffix.lower()

    if extension in [".joblib", ".pkl"]:
        return joblib.load(path)

    if extension in [".keras", ".h5"]:
        from tensorflow.keras.models import load_model as keras_load
        return keras_load(path)

    raise ValueError(f"Unsupported model format: {extension}")


def load_all_models():
    loaded = []
    failed = []

    with model_lock:
        for name in MODEL_FILES:
            try:
                models[name] = load_model(name)
                model_errors.pop(name, None)
                loaded.append(name)

            except Exception as error:
                models.pop(name, None)
                model_errors[name] = str(error)
                failed.append(name)
                logger.exception("Model loading failed: %s", name)

    return {
        "loaded": loaded,
        "failed": failed,
        "total": len(MODEL_FILES)
    }


def get_model(name):
    if name not in MODEL_FILES:
        raise ValueError(f"Unknown model: {name}")

    with model_lock:
        model = models.get(name)

    if model is None:
        raise RuntimeError(f"{name} model is not loaded")

    return model


def predict(name, input_data):
    model = get_model(name)

    data = np.asarray(input_data, dtype=np.float32)

    if not np.isfinite(data).all():
        raise ValueError("Invalid input values")

    if data.ndim == 1:
        data = data.reshape(1, -1)

    if not hasattr(model, "predict"):
        raise TypeError("Model does not support prediction")

    result = model.predict(data)

    if hasattr(result, "tolist"):
        result = result.tolist()

    return {
        "success": True,
        "module": name,
        "prediction": result
    }



def predict_crop(data):
    import pandas as pd

    model = get_model("crop")

    features = [
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall"
    ]

    if not isinstance(data, dict):
        raise ValueError("Input must be a dictionary")

    missing = [key for key in features if key not in data]

    if missing:
        raise ValueError(f"Missing inputs: {missing}")

    try:
        sample = pd.DataFrame(
            [[float(data[key]) for key in features]],
            columns=features
        )

        if not sample.notna().all().all():
            raise ValueError("Invalid input values")

        if not np.isfinite(sample.to_numpy()).all():
            raise ValueError("Input values must be finite")

        prediction = model.predict(sample)

        return {
            "success": True,
            "module": "crop",
            "recommended_crop": str(prediction[0])
        }

    except (ValueError, TypeError):
        raise
    except Exception as error:
        logger.exception("Crop prediction failed")
        raise RuntimeError("Crop prediction failed") from error



def predict_disease(data):
    return predict("disease", data)


def predict_fertilizer(data):
    return predict("fertilizer", data)


def predict_market(data):
    return predict("market", data)


def predict_soil(data):
    return predict("soil", data)


def predict_yield(data):
    return predict("yield", data)


def get_model_status():
    with model_lock:
        return {
            name: {
                "loaded": name in models,
                "error": model_errors.get(name)
            }
            for name in MODEL_FILES
        }


def reload_models():
    with model_lock:
        models.clear()
        model_errors.clear()

    return load_all_models()
