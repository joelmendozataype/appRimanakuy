from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: str = "*"
    jwt_secret: str = "cambia-esta-clave-en-produccion"
    jwt_expire_minutes: int = 480
    hf_api_token: str = ""


settings = Settings()
