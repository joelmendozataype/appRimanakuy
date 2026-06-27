import { useEffect, useState } from "react";
import { Categoria } from "../../domain/entities/Categoria";
import { GlosarioRepositoryImpl } from "../../data/repositories/GlosarioRepositoryImpl";
import { crearListarCategoriasUseCase } from "../../domain/usecases/glosario";

const repo = new GlosarioRepositoryImpl();
const listarCategorias = crearListarCategoriasUseCase(repo);

export function useCategoriasViewModel() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarCategorias()
      .then(setCategorias)
      .catch(() => setError("No se pudo cargar el glosario"))
      .finally(() => setCargando(false));
  }, []);

  return { categorias, cargando, error };
}
