import os
import re
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from google.api_core.exceptions import GoogleAPICallError, InvalidArgument
from google.auth.exceptions import DefaultCredentialsError
from google.cloud import texttospeech
from google.cloud import translate_v2
from pydantic import BaseModel, Field

app = FastAPI(title="AI Farm Management Platform API")


class SpeechRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4500)
    language_code: str = Field(pattern=r"^[a-z]{2,3}(?:-[A-Z]{2})?$")


class TranslationRequest(BaseModel):
    text: str = Field(min_length=1, max_length=4500)
    target_language: str = Field(pattern=r"^[a-z]{2,3}$")


def require_google_credentials() -> None:
    configured_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if configured_path:
        if not Path(configured_path).is_file():
            raise HTTPException(
                status_code=503,
                detail="The file configured by GOOGLE_APPLICATION_CREDENTIALS does not exist.",
            )
        return

    if os.name == "nt":
        app_data = os.environ.get("APPDATA")
        default_path = Path(app_data) / "gcloud" / "application_default_credentials.json" if app_data else None
    else:
        default_path = Path.home() / ".config" / "gcloud" / "application_default_credentials.json"

    managed_google_runtime = any(
        os.environ.get(name)
        for name in ("K_SERVICE", "GAE_ENV", "GCE_METADATA_HOST")
    )
    if not managed_google_runtime and (default_path is None or not default_path.is_file()):
        raise HTTPException(
            status_code=503,
            detail=(
                "Google Cloud credentials are not configured. Run "
                "`gcloud auth application-default login` or set "
                "GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON path."
            ),
        )


@app.post("/api/tts/translate")
def translate_speech_text(request: TranslationRequest) -> dict[str, str]:
    if len(request.text.encode("utf-8")) > 4500:
        raise HTTPException(status_code=413, detail="Translation text must be 4,500 bytes or fewer.")

    if request.target_language == "en":
        return {"translated_text": request.text}

    require_google_credentials()
    try:
        client = translate_v2.Client()
        result = client.translate(
            request.text,
            target_language=request.target_language,
            format_="text",
        )
    except DefaultCredentialsError as error:
        raise HTTPException(
            status_code=503,
            detail="Google Cloud Translation credentials are not configured on the server.",
        ) from error
    except GoogleAPICallError as error:
        raise HTTPException(
            status_code=502,
            detail=f"Google Cloud Translation request failed: {error.message}",
        ) from error

    translated_text = result.get("translatedText")
    if not translated_text:
        raise HTTPException(status_code=502, detail="Google Cloud Translation returned empty text.")

    return {"translated_text": translated_text}


@app.post("/api/tts/synthesize")
def synthesize_speech(request: SpeechRequest) -> Response:
    if len(request.text.encode("utf-8")) > 4500:
        raise HTTPException(status_code=413, detail="Speech text must be 4,500 bytes or fewer.")

    if not re.fullmatch(r"[a-z]{2,3}(?:-[A-Z]{2})?", request.language_code):
        raise HTTPException(status_code=422, detail="Unsupported language code format.")

    require_google_credentials()
    try:
        client = texttospeech.TextToSpeechClient()
        result = client.synthesize_speech(
            input=texttospeech.SynthesisInput(text=request.text),
            voice=texttospeech.VoiceSelectionParams(
                language_code=request.language_code,
                ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
            ),
            audio_config=texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3,
            ),
        )
    except DefaultCredentialsError as error:
        raise HTTPException(
            status_code=503,
            detail="Google Cloud Text-to-Speech credentials are not configured on the server.",
        ) from error
    except InvalidArgument as error:
        raise HTTPException(
            status_code=422,
            detail=f"Google Cloud Text-to-Speech does not have a voice for {request.language_code}.",
        ) from error
    except GoogleAPICallError as error:
        raise HTTPException(
            status_code=502,
            detail=f"Google Cloud Text-to-Speech request failed: {error.message}",
        ) from error

    if not result.audio_content:
        raise HTTPException(status_code=502, detail="Google Cloud Text-to-Speech returned empty audio.")

    return Response(content=result.audio_content, media_type="audio/mpeg")
