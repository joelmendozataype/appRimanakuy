import { Preferencia } from "../entities/Preferencia";

export interface PreferenciaRepository {
  obtener(usuarioId: number, token: string): Promise<Preferencia>;
  actualizar(
    usuarioId: number,
    token: string,
    cambios: Partial<Preferencia>
  ): Promise<Preferencia>;
}
