import { Categoria } from "../entities/Categoria";
import { Frase } from "../entities/Frase";

export interface GlosarioRepository {
  listarCategorias(): Promise<Categoria[]>;
  listarFrasesPorCategoria(categoriaId: number, usuarioId: number): Promise<Frase[]>;
  listarFavoritas(usuarioId: number): Promise<Frase[]>;
  marcarFavorita(usuarioId: number, fraseId: number): Promise<void>;
  desmarcarFavorita(usuarioId: number, fraseId: number): Promise<void>;
}
