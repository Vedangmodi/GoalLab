from fastapi import APIRouter, Depends
from app.database import get_database
from app.middleware.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.post("")
async def create_checkin(checkin_data: dict, user_id: str = Depends(get_current_user)):
    db = get_database()
    
    checkin = {
        "user_id": user_id,
        "goal_id": checkin_data.get("goal_id"),
        "progress_notes": checkin_data.get("progress_notes", ""),
        "completed_milestones": checkin_data.get("completed_milestones", []),
        "challenges": checkin_data.get("challenges", ""),
        "next_steps": checkin_data.get("next_steps", ""),
        "checkin_date": datetime.now()
    }
    
    result = await db.checkins.insert_one(checkin)
    return {"message": "Check-in recorded successfully"}