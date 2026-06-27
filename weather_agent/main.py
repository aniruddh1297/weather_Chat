import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import get_settings
from routers import discover_routers

settings = get_settings()


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("✅ Weather Agent API started")
    print(f"   Model  : {settings.primary_model}")
    print(f"   API Key: {'✓ set' if settings.openrouter_api_key else '✗ NOT SET — set OPENROUTER_API_KEY in .env'}")
    yield
    print("👋 Weather Agent API stopped")


# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Weather Agent API",
    description="LangChain ReAct agent powered by DeepSeek (via OpenRouter) with real-time weather tools.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-register all routers
for r in discover_routers():
    app.include_router(r)


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "time": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "model": settings.primary_model,
        "api_key_set": bool(settings.openrouter_api_key),
    }


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.debug,
    )
