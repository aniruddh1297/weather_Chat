"""
Chat Controller
---------------
Sits between the router (HTTP layer) and the agent service (business logic).
Responsible for:
  - Input validation / sanitisation
  - Calling the agent service
  - Shaping the final response
  - Raising HTTP exceptions on known failure modes
"""

from fastapi import HTTPException

from models.chat import ChatRequest, ChatResponse
from services.agent_service import run_agent


async def handle_chat(request: ChatRequest) -> ChatResponse:
    """
    Entry point called by the router.
    Validates input, delegates to the ReAct agent, and returns a structured response.
    """
    question = request.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    if len(question) > 2000:
        raise HTTPException(status_code=400, detail="Question exceeds maximum length of 2000 characters.")

    try:
        result = await run_agent(question)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Agent execution failed: {str(e)}",
        )

    return ChatResponse(
        answer=result["answer"],
        tools_used=result["tools_used"],
        session_id=request.session_id,
    )
