from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.core.security import create_access_token, verify_password
from app.core.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    usuario: str
    clave: str


class UsuarioSesion(BaseModel):
    usuario_id: int
    nombres: str
    apellidos: str | None
    usuario: str
    rol: str
    establecimiento: str | None


class LoginResponse(BaseModel):
    access_token: str
    usuario: UsuarioSesion


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    credenciales_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario o clave incorrectos"
    )

    response = (
        supabase.table("usuario")
        .select("*, rol(nombre)")
        .eq("usuario", payload.usuario)
        .eq("activo", True)
        .limit(1)
        .execute()
    )
    filas = response.data
    if not filas:
        raise credenciales_invalidas

    fila = filas[0]
    if not verify_password(payload.clave, fila["clave_hash"]):
        raise credenciales_invalidas

    nombre_rol = fila["rol"]["nombre"]
    token = create_access_token(usuario_id=fila["usuario_id"], rol=nombre_rol)

    return LoginResponse(
        access_token=token,
        usuario=UsuarioSesion(
            usuario_id=fila["usuario_id"],
            nombres=fila["nombres"],
            apellidos=fila.get("apellidos"),
            usuario=fila["usuario"],
            rol=nombre_rol,
            establecimiento=fila.get("establecimiento"),
        ),
    )
