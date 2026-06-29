import { VozRepository } from "../../domain/repositories/VozRepository";
import { apiFetchAudioFile, apiUploadAudio } from "../api/httpClient";

interface TranscripcionDto {
  texto: string;
}

export class VozRepositoryImpl implements VozRepository {
  async transcribir(audioUri: string, idioma: string, token: string): Promise<string> {
    const dto = await apiUploadAudio<TranscripcionDto>(
      `/voz/transcribir?idioma=${idioma}`,
      audioUri,
      token
    );
    return dto.texto;
  }

  sintetizarQuechua(texto: string, token: string): Promise<string> {
    return apiFetchAudioFile("/voz/sintetizar", { texto, idioma: "quy" }, token);
  }
}
