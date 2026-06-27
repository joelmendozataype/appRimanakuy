import { Preferencia } from "../entities/Preferencia";
import { PreferenciaRepository } from "../repositories/PreferenciaRepository";

export function crearObtenerPreferenciasUseCase(repo: PreferenciaRepository) {
  return (usuarioId: number, token: string): Promise<Preferencia> =>
    repo.obtener(usuarioId, token);
}

export function crearActualizarPreferenciasUseCase(repo: PreferenciaRepository) {
  return (
    usuarioId: number,
    token: string,
    cambios: Partial<Preferencia>
  ): Promise<Preferencia> => repo.actualizar(usuarioId, token, cambios);
}
