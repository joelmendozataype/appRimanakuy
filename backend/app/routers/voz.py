from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import Response
from pydantic import BaseModel

from app.core.deps import get_usuario_actual
from app.services.asr import ErrorTranscripcion, transcribir_audio
from app.services.tts import ErrorSintesis, sintetizar_quechua

router = APIRouter(prefix="/voz", tags=["voz"])


class TranscripcionResponse(BaseModel):
    texto: str


class SintesisRequest(BaseModel):
    texto: str
    idioma: str = "quy"


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


@router.post("/sintetizar")
def sintetizar(payload: SintesisRequest, _sesion: dict = Depends(get_usuario_actual)):
    if payload.idioma != "quy":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se sintetiza quechua aqui; espanol usa la voz del dispositivo",
        )
    try:
        audio_wav = sintetizar_quechua(payload.texto)
    except ErrorSintesis as err:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(err))

    return Response(content=audio_wav, media_type="audio/wav")
