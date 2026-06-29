from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.core.deps import get_usuario_actual
from app.services.asr import ErrorTranscripcion, transcribir_audio

router = APIRouter(prefix="/voz", tags=["voz"])


class TranscripcionResponse(BaseModel):
    texto: str


@router.post("/transcribir", response_model=TranscripcionResponse)
async def transcribir(
    audio: UploadFile,
    idioma: str = "es",
    _sesion: dict = Depends(get_usuario_actual),
):
    audio_bytes = await audio.read()
    try:
        texto = transcribir_audio(audio_bytes, idioma)
    except ErrorTranscripcion as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err))

    return TranscripcionResponse(texto=texto)
