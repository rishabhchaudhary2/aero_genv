"""
Database initialization script
Run this once to set up database indexes
"""
import asyncio
from config.database import connect_to_mongo, close_mongo_connection

async def init_database():
    """Initialize database with indexes"""
    await connect_to_mongo()
    print("Database initialized successfully!")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(init_database())
