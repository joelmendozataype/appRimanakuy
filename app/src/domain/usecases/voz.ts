import { VozRepository } from "../repositories/VozRepository";

export function crearTranscribirAudioUseCase(repo: VozRepository) {
  return (audioUri: string, idioma: string, token: string): Promise<string> =>
    repo.transcribir(audioUri, idioma, token);
}

export function crearSintetizarQuechuaUseCase(repo: VozRepository) {
  return (texto: string, token: string): Promise<string> => repo.sintetizarQuechua(texto, token);
}
