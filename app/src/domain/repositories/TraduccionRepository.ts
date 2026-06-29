import { Traduccion } from "../entities/Traduccion";

export interface TraduccionRepository {
  traducir(
    texto: string,
    idiomaOrigen: string,
    idiomaDestino: string,
    token: string,
    conversacionId?: number
  ): Promise<Traduccion>;
  confirmar(traduccionId: number, textoCorregido: string, token: string): Promise<Traduccion>;
}
