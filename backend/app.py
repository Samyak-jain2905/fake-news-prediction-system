import os
from pathlib import Path
from typing import Optional

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    title: Optional[str] = Field(default=None, description="News headline")
    text: Optional[str] = Field(default=None, description="News article body")


class PredictionResponse(BaseModel):
    label: str
    score: float


app = FastAPI(title="Fake News Prediction API", default_response_class=ORJSONResponse)

model_dir = Path(os.environ.get("FASTAPI_MODEL_DIR", "../models")).resolve()
vectorizer_path = model_dir / os.environ.get("FASTAPI_VECTORIZER_FILE", "tfidf_vectorizer.joblib")
model_path = model_dir / os.environ.get("FASTAPI_MODEL_FILE", "fake_news_model.joblib")
label_encoder_path = model_dir / os.environ.get("FASTAPI_LABEL_ENCODER_FILE", "label_encoder.joblib")

allowed_origins = os.environ.get("FASTAPI_ALLOW_ORIGINS", "http://localhost:5173,http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ModelArtifacts:
    vectorizer = None
    classifier = None
    label_encoder = None


@app.on_event("startup")
def load_artifacts() -> None:
    if not vectorizer_path.exists() or not model_path.exists() or not label_encoder_path.exists():
        raise RuntimeError(
            f"Missing artifacts in {model_dir}. Train the model first via backend/model_pipeline.py."
        )
    ModelArtifacts.vectorizer = joblib.load(vectorizer_path)
    ModelArtifacts.classifier = joblib.load(model_path)
    ModelArtifacts.label_encoder = joblib.load(label_encoder_path)


@app.get("/health")
def health() -> dict:
    ready = all(
        [
            ModelArtifacts.vectorizer is not None,
            ModelArtifacts.classifier is not None,
            ModelArtifacts.label_encoder is not None,
        ]
    )
    return {"status": "ok" if ready else "not_ready"}


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    if ModelArtifacts.vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    title = payload.title or ""
    text = payload.text or ""

    if not title.strip() and not text.strip():
        raise HTTPException(status_code=422, detail="Provide at least a title or text.")

    combined = f"{title.strip()} {text.strip()}".strip()

    features = ModelArtifacts.vectorizer.transform([combined])
    proba = ModelArtifacts.classifier.predict_proba(features)[0]
    pred_idx = proba.argmax()
    label = ModelArtifacts.label_encoder.inverse_transform([pred_idx])[0]
    score = float(proba[pred_idx])

    return PredictionResponse(label=str(label), score=round(score, 4))

