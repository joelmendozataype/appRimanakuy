"""Descarga el modelo NLLB-200-distilled-600M con reintentos automaticos.
Ejecutar una sola vez antes de levantar el backend (uvicorn carga el
modelo desde el cache local en app/services/mt.py).
"""

import os
import time

os.environ.setdefault(
    "HF_HOME", os.path.join(os.path.dirname(__file__), ".cache", "huggingface")
)
# hf_xet se quedaba colgado (conexiones en CLOSE_WAIT sin avanzar);
# se fuerza el descargador HTTP clasico, que si progresaba y soporta resume.
os.environ["HF_HUB_DISABLE_XET"] = "1"
os.environ.setdefault("HF_HUB_DOWNLOAD_TIMEOUT", "30")

import sys

from huggingface_hub import snapshot_download  # noqa: E402

MODELOS = sys.argv[1:] or ["facebook/nllb-200-distilled-600M"]
MAX_INTENTOS = 30

for modelo in MODELOS:
    for intento in range(1, MAX_INTENTOS + 1):
        try:
            ruta = snapshot_download(repo_id=modelo, max_workers=2)
            print(f"[{modelo}] Descarga completa en: {ruta}")
            break
        except Exception as err:  # noqa: BLE001
            print(f"[{modelo}] Intento {intento}/{MAX_INTENTOS} fallo: {err}")
            time.sleep(5)
    else:
        raise SystemExit(f"No se pudo completar la descarga de {modelo} tras varios intentos")
