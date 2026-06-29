import { useCallback, useEffect, useState } from "react";
import { reproducirVoz } from "../../core/audio/reproducirVoz";
import { Frase } from "../../domain/entities/Frase";
import { useAuth } from "../../core/auth/AuthContext";
import { GlosarioRepositoryImpl } from "../../data/repositories/GlosarioRepositoryImpl";
import {
  crearAlternarFavoritaUseCase,
  crearListarFrasesUseCase,
} from "../../domain/usecases/glosario";

const repo = new GlosarioRepositoryImpl();
const listarFrases = crearListarFrasesUseCase(repo);
const alternarFavorita = crearAlternarFavoritaUseCase(repo);

export function useFrasesViewModel(categoriaId: number) {
  const { usuario, accessToken } = useAuth();
  const [frases, setFrases] = useState<Frase[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!usuario) return;
    listarFrases(categoriaId, usuario.usuarioId)
      .then(setFrases)
      .catch((err) => {
        console.error("Error al cargar frases", err);
        setError("No se pudieron cargar las frases");
      })
      .finally(() => setCargando(false));
  }, [categoriaId, usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const reproducir = (texto: string, idioma: "es" | "quy") => {
    reproducirVoz(texto, idioma, accessToken);
  };

  const alternarFavorito = async (frase: Frase) => {
    if (!usuario) return;
    await alternarFavorita(usuario.usuarioId, frase);
    cargar();
  };

  return { frases, cargando, error, reproducir, alternarFavorito };
}
