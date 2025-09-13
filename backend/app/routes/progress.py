from fastapi import APIRouter, Depends
from app.database import get_database
from app.middleware.auth import get_current_user

router = APIRouter()

@router.get("/{goal_id}")
async def get_goal_progress(goal_id: str, user_id: str = Depends(get_current_user)):
    db = get_database()
    
    goal = await db.goals.find_one({"_id": goal_id, "user_id": user_id})
    checkins = await db.checkins.find({"goal_id": goal_id}).to_list(100)
    
    return {
        "goal": goal,
        "checkins": checkins,
        "progress_metrics": calculate_metrics(goal, checkins)
    }

def calculate_metrics(goal, checkins):
    return {"completion_rate": 0, "velocity": 0}