import { Traduccion } from "../entities/Traduccion";
import { TraduccionRepository } from "../repositories/TraduccionRepository";

export function crearTraducirTextoUseCase(repo: TraduccionRepository) {
  return (
    texto: string,
    idiomaOrigen: string,
    idiomaDestino: string,
    token: string,
    conversacionId?: number
  ): Promise<Traduccion> => {
    if (!texto.trim()) throw new Error("Escribe un texto para traducir");
    return repo.traducir(texto.trim(), idiomaOrigen, idiomaDestino, token, conversacionId);
  };
}

export function crearConfirmarTraduccionUseCase(repo: TraduccionRepository) {
  return (traduccionId: number, textoCorregido: string, token: string): Promise<Traduccion> =>
    repo.confirmar(traduccionId, textoCorregido.trim(), token);
}
