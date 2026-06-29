import { Traduccion } from "../../domain/entities/Traduccion";
import { TraduccionRepository } from "../../domain/repositories/TraduccionRepository";
import { apiFetch } from "../api/httpClient";

interface TraduccionDto {
  conversacion_id: number;
  mensaje_id: number;
  traduccion_id: number;
  texto_traducido: string;
  confianza: number | null;
}

function aDominio(dto: TraduccionDto): Traduccion {
  return {
    conversacionId: dto.conversacion_id,
    mensajeId: dto.mensaje_id,
    traduccionId: dto.traduccion_id,
    textoTraducido: dto.texto_traducido,
    confianza: dto.confianza,
  };
}

export class TraduccionRepositoryImpl implements TraduccionRepository {
  async traducir(
    texto: string,
    idiomaOrigen: string,
    idiomaDestino: string,
    token: string,
    conversacionId?: number
  ): Promise<Traduccion> {
    const dto = await apiFetch<TraduccionDto>("/traducir", {
      method: "POST",
      token,
      body: {
        texto,
        idioma_origen: idiomaOrigen,
        idioma_destino: idiomaDestino,
        conversacion_id: conversacionId,
      },
    });
    return aDominio(dto);
  }

  async confirmar(traduccionId: number, textoCorregido: string, token: string): Promise<Traduccion> {
    const dto = await apiFetch<TraduccionDto>(`/traducir/${traduccionId}/confirmar`, {
      method: "PUT",
      token,
      body: { texto_corregido: textoCorregido },
    });
    return aDominio(dto);
  }
}
