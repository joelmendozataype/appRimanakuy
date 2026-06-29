"""Servicio de reconocimiento de voz (ASR) con Whisper-base local.

Whisper no tiene soporte para quechua Chanka, asi que este servicio se
usa solo para transcribir la voz del personal de salud en espanol; la
respuesta del paciente en quechua se gestiona como texto (HU-12,
conversacion asistida) hasta contar con un modelo Whisper afinado para
quechua (ver nota en la guia sobre recoleccion de corpus de audio).
"""

import os

os.environ.setdefault(
    "HF_HOME", os.path.join(os.path.dirname(__file__), "..", "..", ".cache", "huggingface")
)
_FFMPEG_DIR = (
    r"C:\Users\Nurbank\AppData\Local\Microsoft\WinGet\Packages"
    r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin"
)
if os.path.isdir(_FFMPEG_DIR) and _FFMPEG_DIR not in os.environ.get("PATH", ""):
    os.environ["PATH"] = os.environ.get("PATH", "") + os.pathsep + _FFMPEG_DIR

from transformers import pipeline  # noqa: E402

HF_MODELO = "openai/whisper-base"

_transcriptor = None


class ErrorTranscripcion(Exception):
    pass


def _cargar_modelo():
    global _transcriptor
    if _transcriptor is None:
        _transcriptor = pipeline("automatic-speech-recognition", model=HF_MODELO)
    return _transcriptor


def transcribir_audio(audio_bytes: bytes, idioma: str = "es") -> str:
    transcriptor = _cargar_modelo()
    try:
        resultado = transcriptor(audio_bytes, generate_kwargs={"language": idioma})
    except Exception as err:  # noqa: BLE001
        raise ErrorTranscripcion(f"No se pudo transcribir el audio: {err}")

    texto = resultado.get("text", "").strip()
    if not texto:
        raise ErrorTranscripcion("No se detecto voz en el audio")
    return texto
