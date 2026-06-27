-- =====================================================================
--  RIMANAKUY-Salud — Script de base de datos (SQLite)
--  Base local en el dispositivo (modo sin conexion: glosario, frases,
--  historial y preferencias). App Espanol <-> Quechua Chanka (salud).
--  Nota: SQLite usa tipado dinamico; AUTOINCREMENT exige INTEGER PRIMARY KEY.
-- =====================================================================

PRAGMA foreign_keys = ON;   -- activar la integridad referencial

-- Limpieza previa (hijas antes que padres)
DROP TABLE IF EXISTS favorito;
DROP TABLE IF EXISTS reporte;
DROP TABLE IF EXISTS traduccion;
DROP TABLE IF EXISTS mensaje;
DROP TABLE IF EXISTS conversacion;
DROP TABLE IF EXISTS frase;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS glosario;
DROP TABLE IF EXISTS preferencia;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS rol;

-- ---------------------------------------------------------------------
-- Modulo de acceso y usuarios
-- ---------------------------------------------------------------------
CREATE TABLE rol (
    rol_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE usuario (
    usuario_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    rol_id          INTEGER NOT NULL,
    nombres         TEXT NOT NULL,
    apellidos       TEXT,
    usuario         TEXT NOT NULL UNIQUE,
    clave_hash      TEXT NOT NULL,                         -- bcrypt, nunca texto plano
    establecimiento TEXT,
    activo          INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0,1)),
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES rol(rol_id)
);

CREATE TABLE preferencia (
    preferencia_id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL UNIQUE,                -- UNIQUE => relacion 1:1
    idioma_origen  TEXT DEFAULT 'es',
    idioma_destino TEXT DEFAULT 'quy',
    tamano_letra   TEXT DEFAULT 'normal',
    voz_activada   INTEGER NOT NULL DEFAULT 1 CHECK (voz_activada IN (0,1)),
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Modulo de glosario clinico bilingue
-- ---------------------------------------------------------------------
CREATE TABLE glosario (
    glosario_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    dominio             TEXT NOT NULL,
    version             TEXT,
    fecha_actualizacion DATE
);

CREATE TABLE categoria (
    categoria_id INTEGER PRIMARY KEY AUTOINCREMENT,
    glosario_id  INTEGER NOT NULL,
    nombre       TEXT NOT NULL,
    FOREIGN KEY (glosario_id) REFERENCES glosario(glosario_id) ON DELETE CASCADE
);

CREATE TABLE frase (
    frase_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id     INTEGER NOT NULL,
    frase_es         TEXT NOT NULL,
    frase_qu         TEXT NOT NULL,
    audio_url        TEXT,
    validado_por     TEXT,
    fecha_validacion DATE,
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Modulo de conversacion y traduccion
-- ---------------------------------------------------------------------
CREATE TABLE conversacion (
    conversacion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id      INTEGER NOT NULL,
    fecha_inicio    DATETIME DEFAULT CURRENT_TIMESTAMP,
    idioma_origen   TEXT,
    idioma_destino  TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
);

CREATE TABLE mensaje (
    mensaje_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    conversacion_id INTEGER NOT NULL,
    texto_origen    TEXT,
    texto_destino   TEXT,
    audio_url       TEXT,
    tipo            TEXT NOT NULL DEFAULT 'texto' CHECK (tipo IN ('voz','texto')),
    creado_en       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversacion_id) REFERENCES conversacion(conversacion_id) ON DELETE CASCADE
);

CREATE TABLE traduccion (
    traduccion_id INTEGER PRIMARY KEY AUTOINCREMENT,
    mensaje_id    INTEGER NOT NULL UNIQUE,                 -- UNIQUE => relacion 1:1
    motor         TEXT DEFAULT 'NLLB-200',
    confianza     REAL,
    validada      INTEGER NOT NULL DEFAULT 0 CHECK (validada IN (0,1)),
    FOREIGN KEY (mensaje_id) REFERENCES mensaje(mensaje_id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Favoritos (relacion N:M Usuario <-> Frase) y reportes
-- ---------------------------------------------------------------------
CREATE TABLE favorito (
    favorito_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id    INTEGER NOT NULL,
    frase_id      INTEGER NOT NULL,
    fecha_marcado DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, frase_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (frase_id)   REFERENCES frase(frase_id)     ON DELETE CASCADE
);

CREATE TABLE reporte (
    reporte_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    generado_por     INTEGER NOT NULL,
    periodo_inicio   DATE,
    periodo_fin      DATE,
    fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generado_por) REFERENCES usuario(usuario_id)
);

-- ---------------------------------------------------------------------
-- Indices en claves foraneas y campos de busqueda frecuente
-- ---------------------------------------------------------------------
CREATE INDEX idx_conv_usuario ON conversacion(usuario_id);
CREATE INDEX idx_msg_conv     ON mensaje(conversacion_id);
CREATE INDEX idx_frase_cat    ON frase(categoria_id);
CREATE INDEX idx_fav_usuario  ON favorito(usuario_id);

-- ---------------------------------------------------------------------
-- Datos semilla minimos (roles)
-- ---------------------------------------------------------------------
INSERT INTO rol (nombre, descripcion) VALUES
    ('administrador',  'Gestiona usuarios, glosario y reportes'),
    ('personal_salud', 'Usa la app de traduccion en el punto de atencion');
