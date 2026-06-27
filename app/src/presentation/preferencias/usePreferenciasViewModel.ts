import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Preferencia } from "../../domain/entities/Preferencia";
import { useAuth } from "../../core/auth/AuthContext";
import { PreferenciaRepositoryImpl } from "../../data/repositories/PreferenciaRepositoryImpl";
import {
  crearActualizarPreferenciasUseCase,
  crearObtenerPreferenciasUseCase,
} from "../../domain/usecases/preferencias";

const repo = new PreferenciaRepositoryImpl();
const obtenerPreferencias = crearObtenerPreferenciasUseCase(repo);
const actualizarPreferencias = crearActualizarPreferenciasUseCase(repo);

export function usePreferenciasViewModel() {
  const { usuario, accessToken } = useAuth();
  const router = useRouter();

  const [preferencia, setPreferencia] = useState<Preferencia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario || !accessToken) return;
    obtenerPreferencias(usuario.usuarioId, accessToken)
      .then(setPreferencia)
      .catch(() => setError("No se pudo cargar tus preferencias"))
      .finally(() => setCargando(false));
  }, [usuario, accessToken]);

  const actualizar = async (cambios: Partial<Preferencia>) => {
    if (!usuario || !accessToken) return;
    setGuardando(true);
    try {
      const actualizada = await actualizarPreferencias(usuario.usuarioId, accessToken, cambios);
      setPreferencia(actualizada);
    } catch {
      setError("No se pudo guardar el cambio");
    } finally {
      setGuardando(false);
    }
  };

  const continuar = () => router.replace("/");

  return { usuario, preferencia, cargando, guardando, error, actualizar, continuar };
}
