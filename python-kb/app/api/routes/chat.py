from fastapi import APIRouter

from app.graph.kb_graph import run_kb_graph
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    result = await run_kb_graph(question=request.question)
    return ChatResponse(**result)
