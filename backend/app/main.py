from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import auth, glosario, preferencia, traducir, usuario, voz

app = FastAPI(title="RIMANAKUY-Salud API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(usuario.router)
app.include_router(preferencia.router)
app.include_router(glosario.router)
app.include_router(traducir.router)
app.include_router(voz.router)


@app.get("/health")
def health():
    return {"status": "ok"}
