import pytz
from config.database import get_database
from models.user import UserInDB, UserCreate
from services.auth_service import get_password_hash
from typing import Optional
from datetime import datetime
from bson import ObjectId

async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Get user by email"""
    db = await get_database()
    user_dict = await db.users.find_one({"email": email})
    if user_dict:
        return UserInDB(**user_dict)
    return None

async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
    """Get user by ID"""
    db = await get_database()
    user_dict = await db.users.find_one({"_id": ObjectId(user_id)})
    if user_dict:
        return UserInDB(**user_dict)
    return None

async def get_user_by_google_id(google_id: str) -> Optional[UserInDB]:
    """Get user by Google ID"""
    db = await get_database()
    user_dict = await db.users.find_one({"google_id": google_id})
    if user_dict:
        return UserInDB(**user_dict)
    return None

async def create_user(user_data: UserCreate) -> UserInDB:
    """Create a new user"""
    db = await get_database()
    
    user_dict = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": get_password_hash(user_data.password),
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.now(tz = pytz.timezone('Asia/Kolkata')),
        "updated_at": datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    return UserInDB(**user_dict)

async def create_google_user(email: str, google_id: str, full_name: Optional[str] = None, profile_picture: Optional[str] = None) -> UserInDB:
    """Create a new user from Google OAuth"""
    db = await get_database()
    
    user_dict = {
        "email": email,
        "full_name": full_name,
        "google_id": google_id,
        "profile_picture": profile_picture,
        "is_active": True,
        "is_verified": True,  # Google accounts are pre-verified
        "created_at": datetime.now(tz = pytz.timezone('Asia/Kolkata')),
        "updated_at": datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    return UserInDB(**user_dict)

async def update_user(user_id: str, update_data: dict) -> Optional[UserInDB]:
    """Update user information"""
    db = await get_database()
    
    update_data["updated_at"] = datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    return await get_user_by_id(user_id)
