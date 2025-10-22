from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
db = Database()

async def get_database():
    return db.client.aero_club

async def connect_to_mongo():
    """Connect to MongoDB"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db.client = AsyncIOMotorClient(mongodb_url)
    print("Connected to MongoDB")
    
    # Create indexes
    database = await get_database()
    
    # Users collection indexes
    await database.users.create_index("email", unique=True)
    await database.users.create_index("google_id", sparse=True)
    
    # OTPs collection indexes
    await database.otps.create_index("email")
    await database.otps.create_index("expires_at", expireAfterSeconds=0)  # TTL index
    
    # Pending users collection indexes
    await database.pending_users.create_index("email", unique=True)
    await database.pending_users.create_index("created_at", expireAfterSeconds=86400)  # Expire after 24 hours
    
    print("Database indexes created")
    
async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")
