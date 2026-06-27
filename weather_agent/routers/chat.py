from fastapi import APIRouter

from controllers.chat_controller import handle_chat
from models.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Ask the AI weather agent a question.

    The agent has access to two tools:
    - **get_current_weather** – real-time weather for any city
    - **get_weather_forecast** – multi-day daily forecast for any city

    Example questions:
    - "What is the weather like in Berlin right now?"
    - "Will it rain in Tokyo this week?"
    - "Compare the 3-day forecast for London and Paris."
    - "Should I pack an umbrella for my trip to Barcelona tomorrow?"
    """
    return await handle_chat(request)
