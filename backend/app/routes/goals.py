from fastapi import APIRouter, HTTPException, Depends, status
from bson import ObjectId
from typing import List
from datetime import datetime
from app.middleware.auth import get_current_user
from app.schemas.goal import GoalUpdate
from app.database import get_database
import json

router = APIRouter()

def goal_helper(goal) -> dict:
    return {
        "id": goal["_id"],
        "title": goal["title"],
        "description": goal["description"],
        "category": goal["category"],
        "complexity": goal["complexity"],
        "duration": goal["duration"],
        "progress": goal["progress"],
        "status": goal["status"],
        "user_id": goal["user_id"],
        "milestones": goal["milestones"],
        "current_week": goal["current_week"],
        "created_at": goal["created_at"]
    }

async def generate_learning_journey(title: str, complexity: str, duration: int):
    """Generate a structured learning journey using AI"""
    try:
        from app.main import clients
        
        prompt = f"""
        Create a {complexity} level learning journey for: {title}
        Duration: {duration} weeks
        Break it into weekly milestones with specific learning objectives.
        Return ONLY valid JSON format with this structure:
        {{
            "milestones": [
                {{
                    "week": 1,
                    "objective": "specific learning objective",
                    "dependencies": [],
                    "resources": ["resource1", "resource2"]
                }}
            ]
        }}
        """
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert learning path designer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        result = response.choices[0].message.content.strip()
        json_start = result.find('{')
        json_end = result.rfind('}') + 1
        json_str = result[json_start:json_end]
        
        return json.loads(json_str)
        
    except Exception as e:
        print(f"AI journey generation failed: {e}")
        return {
            "milestones": [
                {"week": i+1, "objective": f"Week {i+1} learning", "dependencies": [], "resources": []}
                for i in range(duration)
            ]
        }

@router.get("")
async def get_goals(user_id: str = Depends(get_current_user)):
    db = get_database()
    goals = await db.goals.find({"user_id": user_id}).to_list(100)
    for goal in goals:
        goal["_id"] = str(goal["_id"])
    return {"goals": goals}

@router.post("")
async def create_goal(goal_data: dict, user_id: str = Depends(get_current_user)):
    db = get_database()
    
    duration = goal_data.get("duration", 12)
    complexity = goal_data.get("complexity", "intermediate")
    milestones_data = await generate_learning_journey(
        goal_data.get("title", ""), complexity, duration
    )
    
    goal = {
        "title": goal_data.get("title", ""),
        "description": goal_data.get("description", ""),
        "category": goal_data.get("category", ""),
        "complexity": complexity,
        "duration": duration,
        "progress": 0,
        "status": "not_started",
        "user_id": user_id,
        "milestones": milestones_data.get("milestones", []),
        "current_week": 1,
        "created_at": datetime.now()
    }
    
    result = await db.goals.insert_one(goal)
    goal["_id"] = str(result.inserted_id)
    return {"goal": goal}

@router.get("/{goal_id}")
async def get_goal(goal_id: str, user_id: str = Depends(get_current_user)):
    db = get_database()
    
    try:
        goal = await db.goals.find_one({"_id": ObjectId(goal_id), "user_id": user_id})
        if goal:
            goal["_id"] = str(goal["_id"])
            return {"goal": goal}
        else:
            raise HTTPException(status_code=404, detail="Goal not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid goal ID")

@router.put("/{goal_id}")
async def update_goal(goal_id: str, goal_data: GoalUpdate, user_id: str = Depends(get_current_user)):
    """
    Update a specific goal by ID
    """
    db = get_database()
    
    if not ObjectId.is_valid(goal_id):
        raise HTTPException(status_code=400, detail="Invalid goal ID format")
    
    # Check if goal exists and belongs to user
    existing_goal = await db.goals.find_one({
        "_id": ObjectId(goal_id),
        "user_id": user_id
    })
    
    if not existing_goal:
        raise HTTPException(status_code=404, detail="Goal not found or access denied")
    
    # Prepare update data (exclude unset fields)
    update_data = goal_data.dict(exclude_unset=True)
    
    # Update the goal
    await db.goals.update_one(
        {"_id": ObjectId(goal_id)},
        {"$set": update_data}
    )
    
    # Return updated goal
    updated_goal = await db.goals.find_one({"_id": ObjectId(goal_id)})
    updated_goal["_id"] = str(updated_goal["_id"])
    return {"goal": updated_goal}

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, user_id: str = Depends(get_current_user)):
    """
    Delete a specific goal by ID
    """
    db = get_database()
    
    if not ObjectId.is_valid(goal_id):
        raise HTTPException(status_code=400, detail="Invalid goal ID format")
    
    # Check if goal exists and belongs to user
    existing_goal = await db.goals.find_one({
        "_id": ObjectId(goal_id),
        "user_id": user_id
    })
    
    if not existing_goal:
        raise HTTPException(status_code=404, detail="Goal not found or access denied")
    
    # Delete the goal
    result = await db.goals.delete_one({"_id": ObjectId(goal_id)})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=500, detail="Failed to delete goal")
    
    return {"message": "Goal deleted successfully", "deleted_id": goal_id}

@router.put("/{goal_id}/milestone/{week_number}")
async def update_milestone(goal_id: str, week_number: int, update_data: dict, user_id: str = Depends(get_current_user)):
    db = get_database()
    
    try:
        goal = await db.goals.find_one({"_id": ObjectId(goal_id), "user_id": user_id})
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        updated = False
        for milestone in goal.get("milestones", []):
            if milestone["week"] == week_number:
                if "status" in update_data:
                    milestone["status"] = update_data["status"]
                updated = True
                break
        
        if updated:
            total_milestones = len(goal.get("milestones", []))
            completed_milestones = sum(1 for m in goal.get("milestones", []) if m.get("status") == "completed")
            
            progress = int((completed_milestones / total_milestones) * 100) if total_milestones > 0 else 0
            status = "completed" if progress == 100 else "in_progress" if progress > 0 else "not_started"
            
            await db.goals.update_one(
                {"_id": ObjectId(goal_id)},
                {"$set": {
                    "milestones": goal["milestones"],
                    "progress": progress,
                    "status": status,
                    "current_week": week_number
                }}
            )
            
            return {"message": "Milestone updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Milestone not found")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{goal_id}/progress")
async def get_goal_progress(goal_id: str, user_id: str = Depends(get_current_user)):
    db = get_database()
    
    try:
        goal = await db.goals.find_one({"_id": ObjectId(goal_id), "user_id": user_id})
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        milestones = goal.get("milestones", [])
        total = len(milestones)
        completed = sum(1 for m in milestones if m.get("status") == "completed")
        in_progress = sum(1 for m in milestones if m.get("status") == "in_progress")
        
        return {
            "progress": goal.get("progress", 0),
            "status": goal.get("status", "not_started"),
            "milestones": {
                "total": total,
                "completed": completed,
                "in_progress": in_progress,
                "not_started": total - completed - in_progress
            },
            "current_week": goal.get("current_week", 1)
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))