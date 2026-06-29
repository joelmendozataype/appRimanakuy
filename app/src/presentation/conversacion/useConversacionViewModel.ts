import { useState } from "react";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { reproducirVoz } from "../../core/audio/reproducirVoz";
import { useAuth } from "../../core/auth/AuthContext";
import { ApiError } from "../../data/api/httpClient";
import { TraduccionRepositoryImpl } from "../../data/repositories/TraduccionRepositoryImpl";
import { VozRepositoryImpl } from "../../data/repositories/VozRepositoryImpl";
import { crearTraducirTextoUseCase } from "../../domain/usecases/traduccion";
import { crearTranscribirAudioUseCase } from "../../domain/usecases/voz";

export interface TurnoConversacion {
  id: string;
  hablante: "personal_salud" | "paciente";
  textoOrigen: string;
  textoTraducido: string;
}

const traduccionRepo = new TraduccionRepositoryImpl();
const vozRepo = new VozRepositoryImpl();
const traducirTexto = crearTraducirTextoUseCase(traduccionRepo);
const transcribirAudio = crearTranscribirAudioUseCase(vozRepo);

export function useConversacionViewModel() {
  const { accessToken } = useAuth();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [conversacionId, setConversacionId] = useState<number | undefined>(undefined);
  const [turnos, setTurnos] = useState<TurnoConversacion[]>([]);
  const [grabando, setGrabando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textoPaciente, setTextoPaciente] = useState("");

  const agregarTurno = (turno: TurnoConversacion) => {
    setTurnos((previos) => [...previos, turno]);
    const idiomaSalida = turno.hablante === "personal_salud" ? "quy" : "es";
    reproducirVoz(turno.textoTraducido, idiomaSalida, accessToken);
  };

  const iniciarGrabacion = async () => {
    setError(null);
    const permiso = await AudioModule.requestRecordingPermissionsAsync();
    if (!permiso.granted) {
      setError("Se necesita permiso de microfono para grabar");
      return;
    }
    await recorder.prepareToRecordAsync();
    recorder.record();
    setGrabando(true);
  };

  const detenerGrabacion = async () => {
    setGrabando(false);
    setProcesando(true);
    setError(null);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!accessToken || !uri) throw new Error("No se pudo grabar el audio");

      const textoEs = await transcribirAudio(uri, "es", accessToken);
      const traduccion = await traducirTexto(textoEs, "es", "quy", accessToken, conversacionId);
      setConversacionId(traduccion.conversacionId);

      agregarTurno({
        id: `personal-${traduccion.mensajeId}`,
        hablante: "personal_salud",
        textoOrigen: textoEs,
        textoTraducido: traduccion.textoTraducido,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo procesar el audio");
    } finally {
      setProcesando(false);
    }
  };

  const enviarRespuestaPaciente = async () => {
    if (!accessToken || !textoPaciente.trim()) return;
    setProcesando(true);
    setError(null);
    try {
      const traduccion = await traducirTexto(
        textoPaciente,
        "quy",
        "es",
        accessToken,
        conversacionId
      );
      setConversacionId(traduccion.conversacionId);

      agregarTurno({
        id: `paciente-${traduccion.mensajeId}`,
        hablante: "paciente",
        textoOrigen: textoPaciente,
        textoTraducido: traduccion.textoTraducido,
      });
      setTextoPaciente("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo traducir la respuesta");
    } finally {
      setProcesando(false);
    }
  };

  return {
    turnos,
    grabando,
    procesando,
    error,
    textoPaciente,
    setTextoPaciente,
    iniciarGrabacion,
    detenerGrabacion,
    enviarRespuestaPaciente,
  };
}
