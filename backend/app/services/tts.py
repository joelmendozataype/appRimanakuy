"""Servicio de sintesis de voz (TTS) para quechua con MMS-TTS (Meta).

facebook/mms-tts-quy es un modelo VITS entrenado para quechua
Ayacucho (el codigo "quy" coincide con el dialecto Chanka usado en
el resto del proyecto). Licencia CC-BY-NC-4.0 (uso no comercial).

Para espanol no se usa este servicio: la app sintetiza con la voz
nativa del dispositivo via expo-speech (ya soporta espanol bien).
"""

import io
import os
import wave

os.environ.setdefault(
    "HF_HOME", os.path.join(os.path.dirname(__file__), "..", "..", ".cache", "huggingface")
)

import numpy as np  # noqa: E402
import torch  # noqa: E402
from transformers import VitsModel, VitsTokenizer  # noqa: E402

HF_MODELO = "facebook/mms-tts-quy"

_tokenizer = None
_modelo = None


class ErrorSintesis(Exception):
    pass


def _cargar_modelo():
    global _tokenizer, _modelo
    if _modelo is None:
        _tokenizer = VitsTokenizer.from_pretrained(HF_MODELO)
        _modelo = VitsModel.from_pretrained(HF_MODELO)
    return _tokenizer, _modelo


def sintetizar_quechua(texto: str) -> bytes:
    if not texto.strip():
        raise ErrorSintesis("El texto a sintetizar esta vacio")

    tokenizer, modelo = _cargar_modelo()
    entradas = tokenizer(texto, return_tensors="pt")

    with torch.no_grad():
        salida = modelo(**entradas).waveform

    audio = salida[0].numpy()
    audio_int16 = np.clip(audio * 32767, -32768, 32767).astype(np.int16)

    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(modelo.config.sampling_rate)
        wav_file.writeframes(audio_int16.tobytes())

    return buffer.getvalue()
