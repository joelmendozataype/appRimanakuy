# RIMANAKUY-Salud

App de traduccion simultanea Espanol &lt;-&gt; Quechua Chanka para personal de salud.

Stack: **React Native (Expo)** + **FastAPI** + **NLLB-200** + **Whisper** + **Coqui TTS** + **Supabase** + **SQLite** + **Docker**.
Metodologia: Scrum. Arquitectura: MVVM + Clean Architecture.

## Estructura del monorepo

```
appRimanakuy/
  app/       # Cliente movil (Expo / React Native, TypeScript)
    src/
      presentation/   # Pantallas, componentes y ViewModels
      domain/          # Entidades y casos de uso
      data/            # Repositorios, SQLite local, cliente backend/Supabase
      core/            # Config, tema, utilidades, navegacion
  backend/   # API en la nube (FastAPI)
    app/
      main.py
      routers/         # /traducir, /voz, /glosario
      services/        # asr (Whisper), mt (NLLB-200), tts (Coqui)
      core/            # Config, Supabase, seguridad
  db/        # Scripts SQL (Supabase/PostgreSQL y SQLite local) + datos de prueba
```

## Requisitos previos

- Node.js LTS y npm
- Expo Go (app movil) o emulador Android/iOS
- Python 3.12+
- Docker (a partir de la Fase 3, para el backend)
- Cuenta de Supabase (proyecto ya creado: `ypynrtwaxaygpgbwquvb`)

## App movil (`app/`)

```bash
cd app
npm install
cp .env.example .env   # completar EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY
npm start
```

## Backend (`backend/`)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # completar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
uvicorn app.main:app --reload
```

## Base de datos (`db/`)

- `rimanakuy_salud_supabase.sql`: esquema para Supabase/PostgreSQL (tablas, RLS, triggers).
- `rimanakuy_salud_sqlite.sql`: esquema para la cache local en el dispositivo.
- `rimanakuy_salud_datos_frases.sql`: datos de prueba del glosario clinico (frases ES &lt;-&gt; QU, pendientes de validacion por hablante nativo).

Ejecutar `rimanakuy_salud_supabase.sql` en el SQL Editor del proyecto de Supabase antes de cargar los datos de prueba.

## Variables de entorno

Nunca se suben llaves al repositorio. Cada carpeta (`app/`, `backend/`) tiene su propio `.env.example`; copiar a `.env` y completar con las credenciales del dashboard de Supabase (Project Settings &gt; API).
