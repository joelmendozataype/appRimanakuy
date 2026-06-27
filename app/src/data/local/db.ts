import * as SQLite from "expo-sqlite";
import {
  CATEGORIAS_SEED,
  GLOSARIO_DOMINIO,
  GLOSARIO_VERSION,
  VALIDADO_POR_DEFECTO,
} from "./seedGlosario";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function abrirBaseDatos(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync("rimanakuy_salud.db");

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS glosario (
      glosario_id         INTEGER PRIMARY KEY AUTOINCREMENT,
      dominio              TEXT NOT NULL,
      version              TEXT,
      fecha_actualizacion  DATE
    );

    CREATE TABLE IF NOT EXISTS categoria (
      categoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
      glosario_id  INTEGER NOT NULL,
      nombre       TEXT NOT NULL,
      FOREIGN KEY (glosario_id) REFERENCES glosario(glosario_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS frase (
      frase_id         INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_id     INTEGER NOT NULL,
      frase_es         TEXT NOT NULL,
      frase_qu         TEXT NOT NULL,
      audio_url        TEXT,
      validado_por     TEXT,
      fecha_validacion DATE,
      FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS favorito (
      favorito_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id    INTEGER NOT NULL,
      frase_id      INTEGER NOT NULL,
      fecha_marcado DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (usuario_id, frase_id),
      FOREIGN KEY (frase_id) REFERENCES frase(frase_id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_frase_cat ON frase(categoria_id);
    CREATE INDEX IF NOT EXISTS idx_fav_usuario ON favorito(usuario_id);
  `);

  await sembrarGlosarioSiVacio(db);

  return db;
}

async function sembrarGlosarioSiVacio(db: SQLite.SQLiteDatabase): Promise<void> {
  const fila = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) as total FROM categoria"
  );
  if ((fila?.total ?? 0) > 0) return;

  await db.withTransactionAsync(async () => {
    const glosario = await db.runAsync(
      "INSERT INTO glosario (dominio, version, fecha_actualizacion) VALUES (?, ?, date('now'))",
      [GLOSARIO_DOMINIO, GLOSARIO_VERSION]
    );
    const glosarioId = glosario.lastInsertRowId;

    for (const categoria of CATEGORIAS_SEED) {
      const filaCategoria = await db.runAsync(
        "INSERT INTO categoria (glosario_id, nombre) VALUES (?, ?)",
        [glosarioId, categoria.nombre]
      );
      const categoriaId = filaCategoria.lastInsertRowId;

      for (const frase of categoria.frases) {
        await db.runAsync(
          "INSERT INTO frase (categoria_id, frase_es, frase_qu, validado_por) VALUES (?, ?, ?, ?)",
          [categoriaId, frase.fraseEs, frase.fraseQu, VALIDADO_POR_DEFECTO]
        );
      }
    }
  });
}

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = abrirBaseDatos();
  return dbPromise;
}
