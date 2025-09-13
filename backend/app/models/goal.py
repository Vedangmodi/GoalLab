from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class Milestone(BaseModel):
    week: int
    objective: str
    dependencies: List[str] = []
    status: str = "not_started"
    resources: List[str] = []

class Goal(BaseModel):
    title: str
    description: str
    category: str
    complexity: str = "intermediate"
    duration: int = 12
    progress: int = 0
    status: str = "not_started"
    user_id: str
    milestones: List[Milestone] = []
    current_week: int = 1
    created_at: datetime = Field(default_factory=datetime.now)