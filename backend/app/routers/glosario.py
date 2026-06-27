from fastapi import APIRouter

from app.core.supabase_client import supabase

router = APIRouter(prefix="/glosario", tags=["glosario"])


@router.get("/categorias")
def listar_categorias():
    response = supabase.table("categoria").select("*").execute()
    return response.data


@router.get("/frases/{categoria_id}")
def listar_frases(categoria_id: int):
    response = (
        supabase.table("frase").select("*").eq("categoria_id", categoria_id).execute()
    )
    return response.data
