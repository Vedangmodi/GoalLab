# Load environment variables FIRST
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import AsyncOpenAI
import json
from fastapi.responses import JSONResponse
from .routes import auth_router, goals_router, checkins_router, progress_router


app = FastAPI()

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(goals_router, prefix="/api/goals", tags=["goals"])
app.include_router(checkins_router, prefix="/api/checkins", tags=["checkins"])
app.include_router(progress_router, prefix="/api/progress", tags=["progress"])

# UPDATED CORS configuration - Added port 5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Added port 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Handle OPTIONS requests globally
@app.middleware("http")
async def options_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content={"message": "OK"})
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "http://localhost:5173")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
        return response
    
    response = await call_next(request)
    return response

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key:
    print(f"OpenAI API Key: {openai_api_key[:15]}...")
    client = AsyncOpenAI(api_key=openai_api_key)
else:
    client = None
    print("❌ OPENAI_API_KEY not found")

# Import and include routes
try:
    from app.routes import auth, goals, progress, checkins
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(goals.router, prefix="/api/goals", tags=["goals"]) 
    app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
    app.include_router(checkins.router, prefix="/api/checkins", tags=["checkins"])
    print("✅ All routes loaded successfully")
except ImportError as e:
    print(f"❌ Failed to import routes: {e}")

@app.websocket("/ws/tutor/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    print(f"✅ User {user_id} connected to AI Tutor")
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            print(f"📨 Received: {message_data}")
            
            if message_data.get("type") == "user_message":
                user_message = message_data.get("message", "")
                context = message_data.get("context", "learning")
                
                ai_response = await generate_ai_response(user_message, context)
                
                response_data = {
                    "type": "ai_response",
                    "message": ai_response,
                    "timestamp": message_data.get("timestamp")
                }
                
                await websocket.send_text(json.dumps(response_data))
                print(f"📤 Sent: {ai_response}")
    
    except WebSocketDisconnect:
        print(f"❌ User {user_id} disconnected")
    except Exception as e:
        print(f"❌ Error: {e}")
        await websocket.close(code=1011)

async def generate_ai_response(user_message: str, context: str) -> str:
    if client is None:
        return "I'm here to help with your learning goals!"
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": f"Context: {context}\nQuestion: {user_message}"}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return "You exceeded your current quota!"

@app.get("/")
async def root():
    return {"message": "AI Learning Tutor API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}