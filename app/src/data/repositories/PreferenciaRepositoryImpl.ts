import { Preferencia } from "../../domain/entities/Preferencia";
import { PreferenciaRepository } from "../../domain/repositories/PreferenciaRepository";
import { apiFetch } from "../api/httpClient";

interface PreferenciaDto {
  idioma_origen: string;
  idioma_destino: string;
  tamano_letra: Preferencia["tamanoLetra"];
  voz_activada: boolean;
}

function aDominio(dto: PreferenciaDto): Preferencia {
  return {
    idiomaOrigen: dto.idioma_origen,
    idiomaDestino: dto.idioma_destino,
    tamanoLetra: dto.tamano_letra,
    vozActivada: dto.voz_activada,
  };
}

export class PreferenciaRepositoryImpl implements PreferenciaRepository {
  async obtener(usuarioId: number, token: string): Promise<Preferencia> {
    const dto = await apiFetch<PreferenciaDto>(`/preferencia/${usuarioId}`, { token });
    return aDominio(dto);
  }

  async actualizar(
    usuarioId: number,
    token: string,
    cambios: Partial<Preferencia>
  ): Promise<Preferencia> {
    const dto = await apiFetch<PreferenciaDto>(`/preferencia/${usuarioId}`, {
      method: "PUT",
      token,
      body: {
        idioma_origen: cambios.idiomaOrigen,
        idioma_destino: cambios.idiomaDestino,
        tamano_letra: cambios.tamanoLetra,
        voz_activada: cambios.vozActivada,
      },
    });
    return aDominio(dto);
  }
}
