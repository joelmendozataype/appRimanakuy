import { Categoria } from "../../domain/entities/Categoria";
import { Frase } from "../../domain/entities/Frase";
import { GlosarioRepository } from "../../domain/repositories/GlosarioRepository";
import { getDb } from "../local/db";

interface CategoriaRow {
  categoria_id: number;
  nombre: string;
}

interface FraseRow {
  frase_id: number;
  categoria_id: number;
  frase_es: string;
  frase_qu: string;
  es_favorita: number;
}

export class GlosarioRepositoryImpl implements GlosarioRepository {
  async listarCategorias(): Promise<Categoria[]> {
    const db = await getDb();
    const filas = await db.getAllAsync<CategoriaRow>(
      "SELECT categoria_id, nombre FROM categoria ORDER BY nombre"
    );
    return filas.map((fila) => ({ categoriaId: fila.categoria_id, nombre: fila.nombre }));
  }

  async listarFrasesPorCategoria(categoriaId: number, usuarioId: number): Promise<Frase[]> {
    const db = await getDb();
    const filas = await db.getAllAsync<FraseRow>(
      `SELECT f.frase_id, f.categoria_id, f.frase_es, f.frase_qu,
              EXISTS (
                SELECT 1 FROM favorito fav
                WHERE fav.frase_id = f.frase_id AND fav.usuario_id = ?
              ) as es_favorita
       FROM frase f
       WHERE f.categoria_id = ?
       ORDER BY f.frase_id`,
      [usuarioId, categoriaId]
    );
    return filas.map(aFrase);
  }

  async listarFavoritas(usuarioId: number): Promise<Frase[]> {
    const db = await getDb();
    const filas = await db.getAllAsync<FraseRow>(
      `SELECT f.frase_id, f.categoria_id, f.frase_es, f.frase_qu, 1 as es_favorita
       FROM frase f
       JOIN favorito fav ON fav.frase_id = f.frase_id
       WHERE fav.usuario_id = ?
       ORDER BY fav.fecha_marcado DESC`,
      [usuarioId]
    );
    return filas.map(aFrase);
  }

  async marcarFavorita(usuarioId: number, fraseId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      "INSERT OR IGNORE INTO favorito (usuario_id, frase_id) VALUES (?, ?)",
      [usuarioId, fraseId]
    );
  }

  async desmarcarFavorita(usuarioId: number, fraseId: number): Promise<void> {
    const db = await getDb();
    await db.runAsync("DELETE FROM favorito WHERE usuario_id = ? AND frase_id = ?", [
      usuarioId,
      fraseId,
    ]);
  }
}

function aFrase(fila: FraseRow): Frase {
  return {
    fraseId: fila.frase_id,
    categoriaId: fila.categoria_id,
    fraseEs: fila.frase_es,
    fraseQu: fila.frase_qu,
    esFavorita: fila.es_favorita === 1,
  };
}
