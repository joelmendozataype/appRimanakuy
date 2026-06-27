from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWTError

from app.core.security import decode_access_token

_bearer_scheme = HTTPBearer()


def get_usuario_actual(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> dict:
    try:
        payload = decode_access_token(credentials.credentials)
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido o expirado"
        )
    return {"usuario_id": int(payload["sub"]), "rol": payload["rol"]}


def requerir_rol(*roles_permitidos: str):
    def _checker(usuario_actual: dict = Depends(get_usuario_actual)) -> dict:
        if usuario_actual["rol"] not in roles_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
            )
        return usuario_actual

    return _checker
