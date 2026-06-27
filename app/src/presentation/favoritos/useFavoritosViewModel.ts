import { useCallback, useEffect, useState } from "react";
import * as Speech from "expo-speech";
import { Frase } from "../../domain/entities/Frase";
import { useAuth } from "../../core/auth/AuthContext";
import { GlosarioRepositoryImpl } from "../../data/repositories/GlosarioRepositoryImpl";
import {
  crearAlternarFavoritaUseCase,
  crearListarFavoritasUseCase,
} from "../../domain/usecases/glosario";

const repo = new GlosarioRepositoryImpl();
const listarFavoritas = crearListarFavoritasUseCase(repo);
const alternarFavorita = crearAlternarFavoritaUseCase(repo);

export function useFavoritosViewModel() {
  const { usuario } = useAuth();
  const [frases, setFrases] = useState<Frase[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => {
    if (!usuario) return;
    listarFavoritas(usuario.usuarioId)
      .then(setFrases)
      .catch(() => setError("No se pudieron cargar tus favoritos"))
      .finally(() => setCargando(false));
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const reproducir = (texto: string, idioma: "es" | "qu") => {
    Speech.stop();
    Speech.speak(texto, { language: idioma === "es" ? "es" : undefined });
  };

  const quitarFavorito = async (frase: Frase) => {
    if (!usuario) return;
    await alternarFavorita(usuario.usuarioId, frase);
    cargar();
  };

  return { frases, cargando, error, reproducir, quitarFavorito };
}
