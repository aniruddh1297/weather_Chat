"""
Weather Service
---------------
Thin async HTTP client wrapping two free, no-key-needed APIs:
  - Open-Meteo Geocoding  → city name → lat/lon
  - Open-Meteo Forecast   → lat/lon  → current & forecast weather

Used exclusively by the LangChain tools in agent_service.py.
"""

import httpx
from core.config import get_settings

settings = get_settings()


async def geocode_city(city: str) -> dict:
    """
    Convert a city name to latitude/longitude using Open-Meteo's free geocoding API.
    Returns: {"lat": float, "lon": float, "name": str, "country": str}
    Raises: ValueError if city not found.
    """
    url = f"{settings.geocoding_api_base_url}/search"
    params = {"name": city, "count": 1, "language": "en", "format": "json"}

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    results = data.get("results")
    if not results:
        raise ValueError(f"City '{city}' not found in geocoding database.")

    r = results[0]
    return {
        "lat": r["latitude"],
        "lon": r["longitude"],
        "name": r.get("name", city),
        "country": r.get("country", ""),
        "timezone": r.get("timezone", "UTC"),
    }


async def get_current_weather(city: str) -> dict:
    """
    Fetch current weather for a city.
    Returns a clean dict with temperature, wind, humidity, etc.
    """
    geo = await geocode_city(city)

    url = f"{settings.weather_api_base_url}/forecast"
    params = {
        "latitude": geo["lat"],
        "longitude": geo["lon"],
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m",
            "precipitation",
            "is_day",
        ],
        "timezone": geo["timezone"],
        "forecast_days": 1,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    current = data.get("current", {})
    units = data.get("current_units", {})

    return {
        "city": geo["name"],
        "country": geo["country"],
        "temperature": current.get("temperature_2m"),
        "temperature_unit": units.get("temperature_2m", "°C"),
        "feels_like": current.get("apparent_temperature"),
        "humidity_percent": current.get("relative_humidity_2m"),
        "wind_speed": current.get("wind_speed_10m"),
        "wind_speed_unit": units.get("wind_speed_10m", "km/h"),
        "wind_direction": current.get("wind_direction_10m"),
        "precipitation_mm": current.get("precipitation"),
        "weather_code": current.get("weather_code"),
        "condition": _wmo_code_to_description(current.get("weather_code", 0)),
        "is_day": bool(current.get("is_day", 1)),
    }


async def get_weather_forecast(city: str, days: int = 5) -> dict:
    """
    Fetch a multi-day daily weather forecast for a city.
    days: 1–16 (Open-Meteo free tier supports up to 16 days)
    """
    days = max(1, min(days, 16))
    geo = await geocode_city(city)

    url = f"{settings.weather_api_base_url}/forecast"
    params = {
        "latitude": geo["lat"],
        "longitude": geo["lon"],
        "daily": [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum",
            "wind_speed_10m_max",
            "sunrise",
            "sunset",
        ],
        "timezone": geo["timezone"],
        "forecast_days": days,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    daily = data.get("daily", {})
    dates = daily.get("time", [])

    forecast_days = []
    for i, date in enumerate(dates):
        forecast_days.append({
            "date": date,
            "condition": _wmo_code_to_description(daily.get("weather_code", [0])[i]),
            "temp_max": daily.get("temperature_2m_max", [])[i] if daily.get("temperature_2m_max") else None,
            "temp_min": daily.get("temperature_2m_min", [])[i] if daily.get("temperature_2m_min") else None,
            "precipitation_mm": daily.get("precipitation_sum", [])[i] if daily.get("precipitation_sum") else None,
            "wind_speed_max": daily.get("wind_speed_10m_max", [])[i] if daily.get("wind_speed_10m_max") else None,
            "sunrise": daily.get("sunrise", [])[i] if daily.get("sunrise") else None,
            "sunset": daily.get("sunset", [])[i] if daily.get("sunset") else None,
        })

    return {
        "city": geo["name"],
        "country": geo["country"],
        "timezone": geo["timezone"],
        "forecast": forecast_days,
    }


# ─── WMO Weather Code → Human-Readable Description ────────────────────────────

def _wmo_code_to_description(code: int) -> str:
    """Map WMO weather interpretation codes to readable strings."""
    _MAP = {
        0: "Clear sky",
        1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Foggy", 48: "Depositing rime fog",
        51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
        56: "Light freezing drizzle", 57: "Heavy freezing drizzle",
        61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
        66: "Light freezing rain", 67: "Heavy freezing rain",
        71: "Slight snowfall", 73: "Moderate snowfall", 75: "Heavy snowfall",
        77: "Snow grains",
        80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
        85: "Slight snow showers", 86: "Heavy snow showers",
        95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
    }
    return _MAP.get(code, f"Unknown (code {code})")
