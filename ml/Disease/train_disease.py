
import json
import random
from pathlib import Path

import tensorflow as tf

ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    ROOT / "datasets" / "disease" /
    "PlantVillage-Dataset-master" / "raw" / "color"
)

MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "disease_detection.keras"
CLASSES_PATH = MODEL_DIR / "disease_classes.json"

IMG_SIZE = (160, 160)
BATCH_SIZE = 32
EPOCHS = 12
SEED = 42

random.seed(SEED)
tf.random.set_seed(SEED)


def get_files():
    classes = sorted(
        p.name for p in DATASET_PATH.iterdir()
        if p.is_dir()
    )

    train, val, test = [], [], []

    for label, name in enumerate(classes):
        files = sorted(
            f for f in (DATASET_PATH / name).iterdir()
            if f.is_file()
            and f.suffix.lower() in [".jpg", ".jpeg", ".png"]
        )

        random.Random(SEED + label).shuffle(files)

        n = len(files)
        n_test = max(1, int(n * 0.15))
        n_val = max(1, int(n * 0.15))

        test.extend((str(f), label) for f in files[:n_test])
        val.extend(
            (str(f), label)
            for f in files[n_test:n_test + n_val]
        )
        train.extend(
            (str(f), label)
            for f in files[n_test + n_val:]
        )

    return classes, train, val, test


def make_dataset(samples, training=False):
    paths, labels = zip(*samples)

    ds = tf.data.Dataset.from_tensor_slices(
        (list(paths), list(labels))
    )

    def load_image(path, label):
        image = tf.io.read_file(path)
        image = tf.io.decode_image(
            image, channels=3, expand_animations=False
        )
        image.set_shape([None, None, 3])
        image = tf.image.resize(image, IMG_SIZE)
        return image, label

    ds = ds.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )

    if training:
        ds = ds.shuffle(2000, seed=SEED)

    return ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)


def build_model(num_classes):
    base = tf.keras.applications.MobileNetV2(
        input_shape=(160, 160, 3),
        include_top=False,
        weights="imagenet"
    )

    base.trainable = False

    inputs = tf.keras.Input(shape=(160, 160, 3))

    x = tf.keras.layers.Rescaling(
        scale=1./127.5, offset=-1
    )(inputs)

    x = base(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(
        num_classes, activation="softmax"
    )(x)

    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(0.001),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    return model


if __name__ == "__main__":

    if not DATASET_PATH.exists():
        raise FileNotFoundError(DATASET_PATH)

    print("Preparing dataset...")

    classes, train, val, test = get_files()

    print("Categories:", len(classes))
    print("Training images:", len(train))
    print("Validation images:", len(val))
    print("Testing images:", len(test))

    with open(CLASSES_PATH, "w") as f:
        json.dump(classes, f, indent=4)

    train_ds = make_dataset(train, True)
    val_ds = make_dataset(val)

    model = build_model(len(classes))
    model.summary()

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            MODEL_PATH,
            monitor="val_accuracy",
            save_best_only=True,
            mode="max"
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=3,
            restore_best_weights=True
        )
    ]

    print("\nStarting MobileNetV2 training...")

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS,
        callbacks=callbacks
    )

    model.save(MODEL_PATH)

    print("\nTraining completed!")
    print("Model saved:", MODEL_PATH)
