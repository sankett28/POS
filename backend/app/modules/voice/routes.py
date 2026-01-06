from fastapi import APIRouter
from app.modules.voice.service import VoiceService

router = APIRouter()
service = VoiceService()

@router.post("/")
async def process_voice(request: dict):
    """Process voice command"""
    return await service.process_command(request)
