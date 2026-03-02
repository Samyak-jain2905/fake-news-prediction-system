import argparse
import json
from pathlib import Path
from typing import Any, Dict, Tuple

import joblib
import pandas as pd
import yaml
from sklearn import metrics
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer


def load_config(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_dataset(cfg: Dict[str, Any]) -> Tuple[pd.Series, pd.Series]:
    csv_path = Path(cfg["dataset"]["train_csv"]).resolve()
    if not csv_path.exists():
        raise FileNotFoundError(
            f"Dataset not found at {csv_path}. "
            "Download a Kaggle fake news dataset into the data/ folder."
        )

    df = pd.read_csv(csv_path)
    text_cols = cfg["dataset"]["text_columns"]
    missing_cols = [col for col in text_cols + [cfg["dataset"]["label_column"]] if col not in df.columns]
    if missing_cols:
        raise ValueError(f"Dataset missing columns: {missing_cols}")

    text_series = df[text_cols].fillna("").agg(" ".join, axis=1)
    labels = df[cfg["dataset"]["label_column"]]
    return text_series, labels


def build_pipeline(cfg: Dict[str, Any]) -> Pipeline:
    vectorizer = TfidfVectorizer(
        max_features=cfg["model"]["max_features"],
        ngram_range=tuple(cfg["model"]["ngram_range"]),
        lowercase=True,
        stop_words="english",
    )
    classifier = LogisticRegression(
        max_iter=200,
        class_weight=cfg["model"]["class_weight"],
        random_state=cfg["model"]["random_state"],
    )
    return Pipeline(
        [
            ("vectorizer", vectorizer),
            ("classifier", classifier),
        ]
    )


def train(cfg: Dict[str, Any]) -> Dict[str, Any]:
    texts, labels = load_dataset(cfg)

    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(labels)

    x_train, x_test, y_train, y_test = train_test_split(
        texts,
        y,
        test_size=cfg["model"]["test_size"],
        random_state=cfg["model"]["random_state"],
        stratify=y,
    )

    pipeline = build_pipeline(cfg)
    pipeline.fit(x_train, y_train)

    y_pred = pipeline.predict(x_test)
    y_proba = pipeline.predict_proba(x_test)[:, 1]

    report = metrics.classification_report(y_test, y_pred, output_dict=True)
    roc_auc = metrics.roc_auc_score(y_test, y_proba)

    artifact_dir = Path(cfg["artifacts"]["directory"])
    artifact_dir.mkdir(parents=True, exist_ok=True)

    joblib.dump(pipeline.named_steps["vectorizer"], artifact_dir / cfg["artifacts"]["vectorizer_filename"])
    joblib.dump(pipeline.named_steps["classifier"], artifact_dir / cfg["artifacts"]["model_filename"])
    joblib.dump(label_encoder, artifact_dir / cfg["artifacts"]["label_encoder_filename"])

    return {
        "macro_f1": report["macro avg"]["f1-score"],
        "weighted_f1": report["weighted avg"]["f1-score"],
        "roc_auc": roc_auc,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train fake news detection model.")
    parser.add_argument("--config", type=Path, default=Path("config.yaml"), help="Path to YAML config.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    cfg = load_config(args.config)
    metrics_payload = train(cfg)
    print(json.dumps(metrics_payload, indent=2))


if __name__ == "__main__":
    main()

