"""
Agent Service
-------------
Builds and runs a LangGraph ReAct agent powered by DeepSeek (via OpenRouter).

Tools available to the agent:
  - get_current_weather  → real-time weather for any city
  - get_weather_forecast → multi-day forecast for any city

The agent decides which tool(s) to call based on the user's question,
then synthesises a final natural-language answer.

Uses langgraph.prebuilt.create_react_agent (modern LangGraph approach,
replaces the deprecated langchain AgentExecutor).
"""

import json
import asyncio
import concurrent.futures
from typing import Annotated

from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

from core.config import get_settings
from services.weather_service import get_current_weather, get_weather_forecast

settings = get_settings()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _run_async_in_thread(coro):
    """
    Run an async coroutine from a sync context.
    LangGraph tool calls happen inside an already-running event loop (FastAPI),
    so we spin up a fresh loop in a thread pool to avoid 'loop already running'.
    """
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        future = pool.submit(asyncio.run, coro)
        return future.result()


# ─── Tool Definitions (LangChain @tool decorator) ────────────────────────────

@tool
def tool_get_current_weather(city: str) -> str:
    """
    Fetch real-time current weather for a city.

    Args:
        city: Name of the city (e.g. 'Berlin', 'New York', 'Tokyo')

    Returns:
        JSON string with temperature, humidity, wind speed, precipitation, and condition.
    """
    try:
        result = _run_async_in_thread(get_current_weather(city.strip()))
        return json.dumps(result, indent=2)
    except ValueError as e:
        return f"Error: {e}"
    except Exception as e:
        return f"Failed to fetch current weather for '{city}': {e}"


@tool
def tool_get_weather_forecast(city: str, days: int = 5) -> str:
    """
    Fetch a multi-day daily weather forecast for a city.

    Args:
        city: Name of the city (e.g. 'London', 'Paris')
        days: Number of forecast days (1-16, default 5)

    Returns:
        JSON string with daily max/min temperature, precipitation, wind, sunrise and sunset.
    """
    try:
        days = max(1, min(int(days), 16))
        result = _run_async_in_thread(get_weather_forecast(city.strip(), days))
        return json.dumps(result, indent=2)
    except ValueError as e:
        return f"Error: {e}"
    except Exception as e:
        return f"Failed to fetch forecast for '{city}': {e}"


TOOLS = [tool_get_current_weather, tool_get_weather_forecast]


# ─── LLM Factory ─────────────────────────────────────────────────────────────

def _build_llm() -> ChatOpenAI:
    """Instantiate the DeepSeek model via OpenRouter's OpenAI-compatible endpoint."""
    return ChatOpenAI(
        model=settings.primary_model,
        openai_api_key=settings.openrouter_api_key,
        openai_api_base=settings.openrouter_base_url,
        temperature=0.2,
        max_tokens=1024,
        default_headers={
            "HTTP-Referer": "https://weather-agent.local",
            "X-Title": "Weather ReAct Agent",
        },
    )


# ─── Public Interface ─────────────────────────────────────────────────────────

async def run_agent(question: str) -> dict:
    """
    Run the ReAct agent against the user's question.

    Returns:
        {
            "answer":     str,
            "tools_used": list[str],
        }
    """
    if not settings.openrouter_api_key:
        return {
            "answer": (
                "⚠️ OpenRouter API key is not configured. "
                "Please set OPENROUTER_API_KEY in your .env file."
            ),
            "tools_used": [],
        }

    llm = _build_llm()
    graph = create_react_agent(model=llm, tools=TOOLS)

    messages = [{"role": "user", "content": question}]
    result = await graph.ainvoke({"messages": messages})

    # ── Extract final answer ──────────────────────────────────────────────────
    final_message = result["messages"][-1]
    answer = (
        final_message.content
        if hasattr(final_message, "content")
        else str(final_message)
    )

    # ── Extract which tools were called ───────────────────────────────────────
    tools_used = []
    for msg in result["messages"]:
        # Tool call messages have a 'tool_calls' attribute (AIMessage)
        if hasattr(msg, "tool_calls") and msg.tool_calls:
            for tc in msg.tool_calls:
                name = tc.get("name") if isinstance(tc, dict) else getattr(tc, "name", None)
                if name and name not in tools_used:
                    tools_used.append(name)

    return {
        "answer": answer,
        "tools_used": tools_used,
    }
