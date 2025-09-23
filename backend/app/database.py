import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import asyncio

# MongoDB connection string
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

try:
    client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    database = client.goallab
    print("✅ MongoDB client created successfully")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")
    # Fallback to None to prevent crashes
    client = None
    database = None

def get_database():
    if database is None:
        raise Exception("Database not connected")
    return database

async def test_connection():
    try:
        if client is None:
            return False
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        return True
    except ConnectionFailure:
        print("❌ MongoDB connection failed: Cannot connect to server")
        return False
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        return False