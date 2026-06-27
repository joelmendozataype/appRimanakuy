from fastapi import APIRouter
from pydantic import BaseModel

from app.services.mt import traducir_texto

router = APIRouter(prefix="/traducir", tags=["traducir"])


class TraduccionRequest(BaseModel):
    texto: str
    idioma_origen: str = "spa_Latn"
    idioma_destino: str = "quy_Latn"


class TraduccionResponse(BaseModel):
    texto_traducido: str
    confianza: float | None = None


@router.post("", response_model=TraduccionResponse)
def traducir(payload: TraduccionRequest):
    texto_traducido, confianza = traducir_texto(
        payload.texto, payload.idioma_origen, payload.idioma_destino
    )
    return TraduccionResponse(texto_traducido=texto_traducido, confianza=confianza)
