"""Servicio de traduccion automatica con NLLB-200 (modelo local, CPU).

El quechua Chanka se aproxima con el codigo "quy_Latn" (quechua
Ayacucho), el dialecto mas cercano disponible en NLLB-200.

El modelo se carga una sola vez (lazy, en el primer request) y se
reutiliza para el resto de la vida del proceso. La primera traduccion
tarda mas porque incluye la carga del modelo a memoria.
"""

import os

os.environ.setdefault(
    "HF_HOME", os.path.join(os.path.dirname(__file__), "..", "..", ".cache", "huggingface")
)

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer  # noqa: E402

HF_MODELO = "facebook/nllb-200-distilled-600M"

CODIGOS_NLLB = {
    "es": "spa_Latn",
    "quy": "quy_Latn",
}

_tokenizer = None
_modelo = None


class ErrorTraduccion(Exception):
    pass


def _cargar_modelo():
    global _tokenizer, _modelo
    if _modelo is None:
        _tokenizer = AutoTokenizer.from_pretrained(HF_MODELO)
        _modelo = AutoModelForSeq2SeqLM.from_pretrained(HF_MODELO)
    return _tokenizer, _modelo


def traducir_texto(
    texto: str, idioma_origen: str, idioma_destino: str
) -> tuple[str, float | None]:
    src_lang = CODIGOS_NLLB.get(idioma_origen)
    tgt_lang = CODIGOS_NLLB.get(idioma_destino)
    if not src_lang or not tgt_lang:
        raise ErrorTraduccion(f"Idioma no soportado: {idioma_origen} -> {idioma_destino}")

    tokenizer, modelo = _cargar_modelo()
    tokenizer.src_lang = src_lang
    entradas = tokenizer(texto, return_tensors="pt")

    id_idioma_destino = tokenizer.convert_tokens_to_ids(tgt_lang)
    salida = modelo.generate(
        **entradas,
        forced_bos_token_id=id_idioma_destino,
        max_length=200,
    )
    texto_traducido = tokenizer.batch_decode(salida, skip_special_tokens=True)[0]

    return texto_traducido, None
