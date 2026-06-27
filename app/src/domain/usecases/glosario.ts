import { Categoria } from "../entities/Categoria";
import { Frase } from "../entities/Frase";
import { GlosarioRepository } from "../repositories/GlosarioRepository";

export function crearListarCategoriasUseCase(repo: GlosarioRepository) {
  return (): Promise<Categoria[]> => repo.listarCategorias();
}

export function crearListarFrasesUseCase(repo: GlosarioRepository) {
  return (categoriaId: number, usuarioId: number): Promise<Frase[]> =>
    repo.listarFrasesPorCategoria(categoriaId, usuarioId);
}

export function crearListarFavoritasUseCase(repo: GlosarioRepository) {
  return (usuarioId: number): Promise<Frase[]> => repo.listarFavoritas(usuarioId);
}

export function crearAlternarFavoritaUseCase(repo: GlosarioRepository) {
  return async (usuarioId: number, frase: Frase): Promise<void> => {
    if (frase.esFavorita) {
      await repo.desmarcarFavorita(usuarioId, frase.fraseId);
    } else {
      await repo.marcarFavorita(usuarioId, frase.fraseId);
    }
  };
}
