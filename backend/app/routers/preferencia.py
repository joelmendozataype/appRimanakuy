from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.deps import get_usuario_actual
from app.core.supabase_client import supabase

router = APIRouter(prefix="/preferencia", tags=["preferencia"])


class PreferenciaOut(BaseModel):
    idioma_origen: str
    idioma_destino: str
    tamano_letra: str
    voz_activada: bool


class PreferenciaUpdate(BaseModel):
    idioma_origen: str | None = None
    idioma_destino: str | None = None
    tamano_letra: str | None = None
    voz_activada: bool | None = None


def _verificar_propietario(sesion: dict, usuario_id: int):
    if sesion["usuario_id"] != usuario_id and sesion["rol"] != "administrador":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")


@router.get("/{usuario_id}", response_model=PreferenciaOut)
def obtener_preferencia(usuario_id: int, sesion: dict = Depends(get_usuario_actual)):
    _verificar_propietario(sesion, usuario_id)
    response = (
        supabase.table("preferencia").select("*").eq("usuario_id", usuario_id).single().execute()
    )
    return PreferenciaOut(**response.data)


@router.put("/{usuario_id}", response_model=PreferenciaOut)
def actualizar_preferencia(
    usuario_id: int, payload: PreferenciaUpdate, sesion: dict = Depends(get_usuario_actual)
):
    _verificar_propietario(sesion, usuario_id)
    cambios = {k: v for k, v in payload.model_dump().items() if v is not None}
    response = (
        supabase.table("preferencia")
        .update(cambios)
        .eq("usuario_id", usuario_id)
        .execute()
    )
    return PreferenciaOut(**response.data[0])
