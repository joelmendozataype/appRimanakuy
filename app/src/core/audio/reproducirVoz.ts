import { createAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import { VozRepositoryImpl } from "../../data/repositories/VozRepositoryImpl";
import { crearSintetizarQuechuaUseCase } from "../../domain/usecases/voz";

const vozRepo = new VozRepositoryImpl();
const sintetizarQuechua = crearSintetizarQuechuaUseCase(vozRepo);

export async function reproducirVoz(
  texto: string,
  idioma: "es" | "quy",
  token: string | null
): Promise<void> {
  Speech.stop();

  if (idioma === "es") {
    Speech.speak(texto, { language: "es" });
    return;
  }

  if (!token) return;
  const uri = await sintetizarQuechua(texto, token);
  const reproductor = createAudioPlayer(uri);
  reproductor.play();
}
