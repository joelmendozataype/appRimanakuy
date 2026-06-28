import { useCallback, useEffect, useState } from "react";
import * as Speech from "expo-speech";
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
  const { usuario } = useAuth();
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

  const reproducir = (texto: string, idioma: "es" | "qu") => {
    Speech.stop();
    // El quechua Chanka no tiene voz TTS dedicada todavia; se usa la voz
    // por defecto del dispositivo como aproximacion hasta tener audio
    // pregrabado (frase.audioUrl) validado por un hablante nativo.
    Speech.speak(texto, { language: idioma === "es" ? "es" : undefined });
  };

  const alternarFavorito = async (frase: Frase) => {
    if (!usuario) return;
    await alternarFavorita(usuario.usuarioId, frase);
    cargar();
  };

  return { frases, cargando, error, reproducir, alternarFavorito };
}
