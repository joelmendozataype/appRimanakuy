-- =====================================================================
--  RIMANAKUY-Salud — Script de base de datos para SUPABASE (PostgreSQL)
--  App de traduccion simultanea Espanol <-> Quechua Chanka (sector salud)
--
--  Como usarlo:
--    Supabase Dashboard  ->  SQL Editor  ->  New query  ->  pega y RUN.
--  Notas:
--    * Tablas en el esquema "public".
--    * Se habilita Row Level Security (RLS) en todas las tablas (recomendado
--      por Supabase). El backend FastAPI accede con la clave service_role,
--      que omite RLS; las politicas de ejemplo cubren el acceso desde el
--      cliente con rol "authenticated".
--    * La autenticacion del personal se modela en la tabla usuario
--      (clave_hash con bcrypt). Si prefieres usar Supabase Auth nativo,
--      ver la nota al final del archivo.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) Funcion de utilidad para mantener updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 2) Tablas (en orden de dependencias)
-- ---------------------------------------------------------------------

-- Roles del sistema
create table if not exists public.rol (
    rol_id      bigint generated always as identity primary key,
    nombre      text not null unique,
    descripcion text
);
comment on table public.rol is 'Roles del sistema (administrador, personal de salud).';

-- Usuarios (personal de salud y administradores)
create table if not exists public.usuario (
    usuario_id      bigint generated always as identity primary key,
    rol_id          bigint not null references public.rol(rol_id),
    nombres         text not null,
    apellidos       text,
    usuario         text not null unique,
    clave_hash      text not null,                      -- bcrypt, nunca texto plano
    establecimiento text,
    activo          boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);
comment on table public.usuario is 'Personal de salud y administradores que usan la app.';

-- Preferencias del usuario (relacion 1:1)
create table if not exists public.preferencia (
    preferencia_id bigint generated always as identity primary key,
    usuario_id     bigint not null unique references public.usuario(usuario_id) on delete cascade,
    idioma_origen  text not null default 'es',
    idioma_destino text not null default 'quy',
    tamano_letra   text not null default 'normal',
    voz_activada   boolean not null default true
);
comment on table public.preferencia is 'Configuracion de idioma y accesibilidad por usuario (1:1).';

-- Glosario clinico bilingue
create table if not exists public.glosario (
    glosario_id         bigint generated always as identity primary key,
    dominio             text not null,
    version             text,
    fecha_actualizacion date,
    updated_at          timestamptz not null default now()
);
comment on table public.glosario is 'Glosario clinico bilingue por dominio (triaje, sintomas, etc.).';

create table if not exists public.categoria (
    categoria_id bigint generated always as identity primary key,
    glosario_id  bigint not null references public.glosario(glosario_id) on delete cascade,
    nombre       text not null
);
comment on table public.categoria is 'Categorias de frases dentro de un glosario.';

create table if not exists public.frase (
    frase_id         bigint generated always as identity primary key,
    categoria_id     bigint not null references public.categoria(categoria_id) on delete cascade,
    frase_es         text not null,
    frase_qu         text not null,
    audio_url        text,
    validado_por     text,
    fecha_validacion date,
    updated_at       timestamptz not null default now()
);
comment on table public.frase is 'Frases clinicas predefinidas en espanol y quechua Chanka.';

-- Conversaciones y mensajes
create table if not exists public.conversacion (
    conversacion_id bigint generated always as identity primary key,
    usuario_id      bigint not null references public.usuario(usuario_id) on delete cascade,
    fecha_inicio    timestamptz not null default now(),
    idioma_origen   text,
    idioma_destino  text
);
comment on table public.conversacion is 'Sesiones de traduccion realizadas por el personal de salud.';

create table if not exists public.mensaje (
    mensaje_id      bigint generated always as identity primary key,
    conversacion_id bigint not null references public.conversacion(conversacion_id) on delete cascade,
    texto_origen    text,
    texto_destino   text,
    audio_url       text,
    tipo            text not null default 'texto' check (tipo in ('voz','texto')),
    creado_en       timestamptz not null default now()
);
comment on table public.mensaje is 'Cada intervencion (voz o texto) dentro de una conversacion.';

create table if not exists public.traduccion (
    traduccion_id bigint generated always as identity primary key,
    mensaje_id    bigint not null unique references public.mensaje(mensaje_id) on delete cascade,  -- 1:1
    motor         text default 'NLLB-200',
    confianza     numeric(4,3),
    validada      boolean not null default false
);
comment on table public.traduccion is 'Resultado de traduccion de un mensaje (1:1 con mensaje).';

-- Favoritos (relacion N:M usuario <-> frase)
create table if not exists public.favorito (
    favorito_id   bigint generated always as identity primary key,
    usuario_id    bigint not null references public.usuario(usuario_id) on delete cascade,
    frase_id      bigint not null references public.frase(frase_id) on delete cascade,
    fecha_marcado timestamptz not null default now(),
    unique (usuario_id, frase_id)
);
comment on table public.favorito is 'Frases marcadas como favoritas por un usuario (N:M).';

-- Reportes de uso
create table if not exists public.reporte (
    reporte_id       bigint generated always as identity primary key,
    generado_por     bigint not null references public.usuario(usuario_id),
    periodo_inicio   date,
    periodo_fin      date,
    fecha_generacion timestamptz not null default now()
);
comment on table public.reporte is 'Reportes de uso generados por el administrador.';

-- ---------------------------------------------------------------------
-- 3) Indices en claves foraneas y campos de busqueda frecuente
-- ---------------------------------------------------------------------
create index if not exists idx_usuario_rol      on public.usuario(rol_id);
create index if not exists idx_conv_usuario      on public.conversacion(usuario_id);
create index if not exists idx_msg_conv          on public.mensaje(conversacion_id);
create index if not exists idx_categoria_glos    on public.categoria(glosario_id);
create index if not exists idx_frase_cat         on public.frase(categoria_id);
create index if not exists idx_fav_usuario       on public.favorito(usuario_id);
create index if not exists idx_fav_frase         on public.favorito(frase_id);
create index if not exists idx_reporte_usuario   on public.reporte(generado_por);

-- ---------------------------------------------------------------------
-- 4) Triggers de updated_at
-- ---------------------------------------------------------------------
drop trigger if exists trg_usuario_updated  on public.usuario;
create trigger trg_usuario_updated  before update on public.usuario
    for each row execute function public.set_updated_at();

drop trigger if exists trg_glosario_updated on public.glosario;
create trigger trg_glosario_updated before update on public.glosario
    for each row execute function public.set_updated_at();

drop trigger if exists trg_frase_updated    on public.frase;
create trigger trg_frase_updated    before update on public.frase
    for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 5) Row Level Security (RLS)
--    Se habilita en todas las tablas. El backend (service_role) omite RLS.
--    Politicas de ejemplo para el rol "authenticated" (cliente movil):
--      - catalogo (glosario/categoria/frase): solo lectura.
--      - resto de tablas: el acceso se hace via backend; ajusta segun tu caso.
-- ---------------------------------------------------------------------
alter table public.rol          enable row level security;
alter table public.usuario      enable row level security;
alter table public.preferencia  enable row level security;
alter table public.glosario     enable row level security;
alter table public.categoria    enable row level security;
alter table public.frase        enable row level security;
alter table public.conversacion enable row level security;
alter table public.mensaje      enable row level security;
alter table public.traduccion   enable row level security;
alter table public.favorito     enable row level security;
alter table public.reporte      enable row level security;

-- Catalogo de solo lectura para usuarios autenticados
create policy "glosario_lectura_autenticados"  on public.glosario
    for select to authenticated using (true);
create policy "categoria_lectura_autenticados" on public.categoria
    for select to authenticated using (true);
create policy "frase_lectura_autenticados"     on public.frase
    for select to authenticated using (true);

-- (Opcional) ejemplo: cada usuario gestiona solo sus favoritos.
-- Requiere que usuario.usuario_id corresponda al usuario autenticado.
-- create policy "favorito_propio" on public.favorito
--     for all to authenticated
--     using (true) with check (true);

-- ---------------------------------------------------------------------
-- 6) Datos semilla minimos (roles)
-- ---------------------------------------------------------------------
insert into public.rol (nombre, descripcion) values
    ('administrador',  'Gestiona usuarios, glosario y reportes'),
    ('personal_salud', 'Usa la app de traduccion en el punto de atencion')
on conflict (nombre) do nothing;

-- =====================================================================
--  NOTA — Integracion con Supabase Auth (opcional)
--  Si en lugar de gestionar la clave en la tabla usuario quieres usar el
--  sistema de autenticacion nativo de Supabase (auth.users):
--    1) Elimina la columna clave_hash.
--    2) Agrega:  auth_id uuid unique references auth.users(id) on delete cascade;
--    3) Crea las politicas RLS usando auth.uid() para comparar contra auth_id.
-- =====================================================================
