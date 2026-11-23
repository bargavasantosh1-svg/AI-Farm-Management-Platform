
import json
import random
from pathlib import Path

import tensorflow as tf

ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    ROOT / "datasets" / "disease" /
    "PlantVillage-Dataset-master" / "raw" / "color"
)

MODEL_PATH = ROOT / "models" / "disease_detection.keras"
CLASSES_PATH = ROOT / "models" / "disease_classes.json"

IMG_SIZE = (160, 160)
BATCH_SIZE = 32
SEED = 42


def get_test_files():
    test_files = []

    classes = sorted(
        folder.name for folder in DATASET_PATH.iterdir()
        if folder.is_dir()
    )

    for label, class_name in enumerate(classes):
        files = sorted(
            file for file in
            (DATASET_PATH / class_name).iterdir()
            if file.is_file()
            and file.suffix.lower() in [".jpg", ".jpeg", ".png"]
        )

        random.Random(SEED + label).shuffle(files)

        test_count = max(1, int(len(files) * 0.15))

        for file in files[:test_count]:
            test_files.append((str(file), label))

    return classes, test_files


def make_test_dataset(samples):
    paths = [item[0] for item in samples]
    labels = [item[1] for item in samples]

    dataset = tf.data.Dataset.from_tensor_slices(
        (paths, labels)
    )

    def load_image(path, label):
        image = tf.io.read_file(path)
        image = tf.io.decode_image(
            image, channels=3, expand_animations=False
        )
        image.set_shape([None, None, 3])
        image = tf.image.resize(image, IMG_SIZE)
        return image, label

    dataset = dataset.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )

    return dataset.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)


if __name__ == "__main__":

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Model not found. Run train_disease.py first."
        )

    print("Loading trained disease model...")

    model = tf.keras.models.load_model(MODEL_PATH)

    with open(CLASSES_PATH, "r") as file:
        classes = json.load(file)

    actual_classes, test_files = get_test_files()

    if classes != actual_classes:
        raise ValueError("Dataset categories have changed.")

    test_ds = make_test_dataset(test_files)

    print("Testing images:", len(test_files))
    print("Disease categories:", len(classes))

    loss, accuracy = model.evaluate(test_ds)

    print("\nDisease Detection Test Results")
    print("------------------------------")
    print(f"Test Accuracy: {accuracy * 100:.2f}%")
    print(f"Test Loss: {loss:.4f}")
    print("Categories:", len(classes))

    print("\nTesting completed!")
