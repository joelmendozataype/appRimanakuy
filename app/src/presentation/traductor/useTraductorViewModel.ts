import { useState } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import { TraduccionRepositoryImpl } from "../../data/repositories/TraduccionRepositoryImpl";
import { ApiError } from "../../data/api/httpClient";
import {
  crearConfirmarTraduccionUseCase,
  crearTraducirTextoUseCase,
} from "../../domain/usecases/traduccion";

const repo = new TraduccionRepositoryImpl();
const traducirTexto = crearTraducirTextoUseCase(repo);
const confirmarTraduccion = crearConfirmarTraduccionUseCase(repo);

export function useTraductorViewModel() {
  const { accessToken } = useAuth();

  const [idiomaOrigen, setIdiomaOrigen] = useState<"es" | "quy">("es");
  const [textoOrigen, setTextoOrigen] = useState("");
  const [textoTraducido, setTextoTraducido] = useState("");
  const [traduccionId, setTraduccionId] = useState<number | null>(null);
  const [conversacionId, setConversacionId] = useState<number | undefined>(undefined);
  const [confirmado, setConfirmado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idiomaDestino = idiomaOrigen === "es" ? "quy" : "es";

  const invertirIdiomas = () => {
    setIdiomaOrigen(idiomaDestino);
    setTextoOrigen(textoTraducido);
    setTextoTraducido("");
    setTraduccionId(null);
    setConfirmado(false);
  };

  const traducir = async () => {
    if (!accessToken) return;
    setError(null);
    setConfirmado(false);
    setCargando(true);
    try {
      const resultado = await traducirTexto(
        textoOrigen,
        idiomaOrigen,
        idiomaDestino,
        accessToken,
        conversacionId
      );
      setTextoTraducido(resultado.textoTraducido);
      setTraduccionId(resultado.traduccionId);
      setConversacionId(resultado.conversacionId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo traducir el texto");
    } finally {
      setCargando(false);
    }
  };

  const confirmar = async () => {
    if (!accessToken || traduccionId === null) return;
    setCargando(true);
    setError(null);
    try {
      const resultado = await confirmarTraduccion(traduccionId, textoTraducido, accessToken);
      setTextoTraducido(resultado.textoTraducido);
      setConfirmado(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo confirmar la correccion");
    } finally {
      setCargando(false);
    }
  };

  return {
    idiomaOrigen,
    idiomaDestino,
    textoOrigen,
    setTextoOrigen,
    textoTraducido,
    setTextoTraducido,
    traduccionId,
    confirmado,
    cargando,
    error,
    invertirIdiomas,
    traducir,
    confirmar,
  };
}
