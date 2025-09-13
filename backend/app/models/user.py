from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    name: str
    email: EmailStr
    hashed_password: str
    email_verified: bool = False
    created_at: datetime = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "User",
                "email": "User@example.com",
                "hashed_password": "hashed_password_here",
                "email_verified": False,
                "created_at": "2023-01-01T00:00:00"
            }
        }