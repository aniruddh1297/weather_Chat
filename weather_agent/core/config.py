from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # LLM via OpenRouter
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    primary_model: str = "deepseek/deepseek-v4-flash"   # DeepSeek Flash V4 via OpenRouter

    # Free Weather API (Open-Meteo — no key needed)
    weather_api_base_url: str = "https://api.open-meteo.com/v1"
    geocoding_api_base_url: str = "https://geocoding-api.open-meteo.com/v1"

    # App
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
