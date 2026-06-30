from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "python-kb"
    app_env: str = "local"
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:8000"
    log_level: str = "INFO"
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    embedding_model: str = "text-embedding-3-small"
    chroma_persist_dir: str = "./data/chroma"
    chroma_collection: str = "ruoyi_kb"
    chunk_size: int = 1000
    chunk_overlap: int = 150

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
