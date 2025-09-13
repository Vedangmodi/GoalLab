from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class GoalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., max_length=500)
    category: str
    complexity: str
    duration: int = Field(..., ge=1, le=52)

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: Optional[str] = None
    complexity: Optional[str] = None
    duration: Optional[int] = Field(None, ge=1, le=52)
    progress: Optional[int] = Field(None, ge=0, le=100)
    status: Optional[str] = None
    current_week: Optional[int] = Field(None, ge=1)

class GoalResponse(GoalBase):
    id: PyObjectId
    progress: int
    status: str
    user_id: str
    milestones: list
    current_week: int
    created_at: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}