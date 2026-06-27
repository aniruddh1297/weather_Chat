from pydantic import BaseModel, Field
from typing import Optional


class ChatRequest(BaseModel):
    question: str = Field(..., description="The user's question for the AI agent")
    session_id: Optional[str] = Field(None, description="Optional session ID for context tracking")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="The agent's final answer")
    tools_used: list[str] = Field(default_factory=list, description="List of tools invoked during this run")
    session_id: Optional[str] = Field(None, description="Session ID echoed back if provided")
