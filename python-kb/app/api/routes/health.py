from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("")
async def api_health() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name, "env": settings.app_env}
