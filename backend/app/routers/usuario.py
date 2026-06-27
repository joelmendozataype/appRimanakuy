from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.deps import get_usuario_actual, requerir_rol
from app.core.security import hash_password
from app.core.supabase_client import supabase

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


class UsuarioOut(BaseModel):
    usuario_id: int
    nombres: str
    apellidos: str | None
    usuario: str
    rol: str
    establecimiento: str | None
    activo: bool


class UsuarioCreate(BaseModel):
    nombres: str
    apellidos: str | None = None
    usuario: str
    clave: str
    rol_id: int
    establecimiento: str | None = None


@router.get("", response_model=list[UsuarioOut])
def listar_usuarios(_=Depends(requerir_rol("administrador"))):
    response = supabase.table("usuario").select("*, rol(nombre)").execute()
    return [
        UsuarioOut(
            usuario_id=fila["usuario_id"],
            nombres=fila["nombres"],
            apellidos=fila.get("apellidos"),
            usuario=fila["usuario"],
            rol=fila["rol"]["nombre"],
            establecimiento=fila.get("establecimiento"),
            activo=fila["activo"],
        )
        for fila in response.data
    ]


@router.post("", response_model=UsuarioOut, status_code=status.HTTP_201_CREATED)
def crear_usuario(payload: UsuarioCreate, _=Depends(requerir_rol("administrador"))):
    existente = (
        supabase.table("usuario").select("usuario_id").eq("usuario", payload.usuario).execute()
    )
    if existente.data:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="El usuario ya existe")

    nuevo = (
        supabase.table("usuario")
        .insert(
            {
                "nombres": payload.nombres,
                "apellidos": payload.apellidos,
                "usuario": payload.usuario,
                "clave_hash": hash_password(payload.clave),
                "rol_id": payload.rol_id,
                "establecimiento": payload.establecimiento,
            }
        )
        .execute()
    )
    fila = nuevo.data[0]
    rol_fila = supabase.table("rol").select("nombre").eq("rol_id", payload.rol_id).execute()

    supabase.table("preferencia").insert({"usuario_id": fila["usuario_id"]}).execute()

    return UsuarioOut(
        usuario_id=fila["usuario_id"],
        nombres=fila["nombres"],
        apellidos=fila.get("apellidos"),
        usuario=fila["usuario"],
        rol=rol_fila.data[0]["nombre"],
        establecimiento=fila.get("establecimiento"),
        activo=fila["activo"],
    )


@router.get("/me", response_model=UsuarioOut)
def usuario_actual(sesion: dict = Depends(get_usuario_actual)):
    response = (
        supabase.table("usuario")
        .select("*, rol(nombre)")
        .eq("usuario_id", sesion["usuario_id"])
        .single()
        .execute()
    )
    fila = response.data
    return UsuarioOut(
        usuario_id=fila["usuario_id"],
        nombres=fila["nombres"],
        apellidos=fila.get("apellidos"),
        usuario=fila["usuario"],
        rol=fila["rol"]["nombre"],
        establecimiento=fila.get("establecimiento"),
        activo=fila["activo"],
    )
