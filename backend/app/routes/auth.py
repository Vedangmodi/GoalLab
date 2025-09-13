from fastapi import APIRouter, HTTPException, status
from app.database import get_database
from app.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime
import traceback
from fastapi.responses import JSONResponse

router = APIRouter()

# Explicit OPTIONS handlers for auth endpoints
@router.api_route("/login", methods=["OPTIONS"])
@router.api_route("/register", methods=["OPTIONS"])
async def auth_options():
    response = JSONResponse(content={"message": "OK"})
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"  # Changed to 5173
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    return response

@router.post("/register")
async def register(user_data: dict):
    try:
        db = get_database()
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data.get("email")})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create user
        hashed_password = get_password_hash(user_data.get("password", ""))
        user = {
            "name": user_data.get("name", ""),
            "email": user_data.get("email", ""),
            "hashed_password": hashed_password,
            "email_verified": False,
            "created_at": datetime.now()
        }
        
        result = await db.users.insert_one(user)
        
        # Create token
        access_token = create_access_token({"sub": str(result.inserted_id)})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(result.inserted_id),
                "name": user["name"],
                "email": user["email"],
                "email_verified": user["email_verified"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed. Please try again."
        )

@router.post("/login")
async def login(credentials: dict):
    try:
        db = get_database()
        
        user = await db.users.find_one({"email": credentials.get("email")})
        if not user or not verify_password(credentials.get("password", ""), user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        access_token = create_access_token({"sub": str(user["_id"])})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "email_verified": user["email_verified"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )