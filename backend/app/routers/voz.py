from fastapi import APIRouter, WebSocket

router = APIRouter(prefix="/voz", tags=["voz"])


@router.websocket("/stream")
async def stream_voz(websocket: WebSocket):
    """Recibe audio en chunks, ejecuta ASR -> MT -> TTS y devuelve el resultado.

    Pendiente de implementar: Whisper (asr), NLLB-200 (mt), Coqui TTS (tts).
    """
    await websocket.accept()
    try:
        while True:
            await websocket.receive_bytes()
            await websocket.send_json({"status": "pendiente_implementacion"})
    except Exception:
        await websocket.close()
