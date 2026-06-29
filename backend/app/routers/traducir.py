from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.deps import get_usuario_actual
from app.core.supabase_client import supabase
from app.services.mt import ErrorTraduccion, traducir_texto

router = APIRouter(prefix="/traducir", tags=["traducir"])


class TraduccionRequest(BaseModel):
    texto: str
    idioma_origen: str = "es"
    idioma_destino: str = "quy"
    conversacion_id: int | None = None


class TraduccionResponse(BaseModel):
    conversacion_id: int
    mensaje_id: int
    traduccion_id: int
    texto_traducido: str
    confianza: float | None = None


class ConfirmarRequest(BaseModel):
    texto_corregido: str


@router.post("", response_model=TraduccionResponse)
def traducir(payload: TraduccionRequest, sesion: dict = Depends(get_usuario_actual)):
    conversacion_id = payload.conversacion_id
    if conversacion_id is None:
        conversacion = (
            supabase.table("conversacion")
            .insert(
                {
                    "usuario_id": sesion["usuario_id"],
                    "idioma_origen": payload.idioma_origen,
                    "idioma_destino": payload.idioma_destino,
                }
            )
            .execute()
        )
        conversacion_id = conversacion.data[0]["conversacion_id"]

    try:
        texto_traducido, confianza = traducir_texto(
            payload.texto, payload.idioma_origen, payload.idioma_destino
        )
    except ErrorTraduccion as err:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(err))

    mensaje = (
        supabase.table("mensaje")
        .insert(
            {
                "conversacion_id": conversacion_id,
                "texto_origen": payload.texto,
                "texto_destino": texto_traducido,
                "tipo": "texto",
            }
        )
        .execute()
    )
    mensaje_id = mensaje.data[0]["mensaje_id"]

    traduccion = (
        supabase.table("traduccion")
        .insert(
            {
                "mensaje_id": mensaje_id,
                "motor": "NLLB-200",
                "confianza": confianza,
                "validada": False,
            }
        )
        .execute()
    )
    traduccion_id = traduccion.data[0]["traduccion_id"]

    return TraduccionResponse(
        conversacion_id=conversacion_id,
        mensaje_id=mensaje_id,
        traduccion_id=traduccion_id,
        texto_traducido=texto_traducido,
        confianza=confianza,
    )


@router.put("/{traduccion_id}/confirmar", response_model=TraduccionResponse)
def confirmar_traduccion(
    traduccion_id: int, payload: ConfirmarRequest, sesion: dict = Depends(get_usuario_actual)
):
    traduccion = (
        supabase.table("traduccion")
        .select("*, mensaje(*, conversacion(usuario_id, conversacion_id))")
        .eq("traduccion_id", traduccion_id)
        .single()
        .execute()
    )
    fila = traduccion.data
    if fila["mensaje"]["conversacion"]["usuario_id"] != sesion["usuario_id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")

    mensaje_id = fila["mensaje"]["mensaje_id"]
    supabase.table("mensaje").update({"texto_destino": payload.texto_corregido}).eq(
        "mensaje_id", mensaje_id
    ).execute()
    supabase.table("traduccion").update({"validada": True}).eq(
        "traduccion_id", traduccion_id
    ).execute()

    return TraduccionResponse(
        conversacion_id=fila["mensaje"]["conversacion"]["conversacion_id"],
        mensaje_id=mensaje_id,
        traduccion_id=traduccion_id,
        texto_traducido=payload.texto_corregido,
        confianza=fila["confianza"],
    )
