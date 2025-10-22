from config.database import get_database
from models.otp import OTPInDB, PendingUserCreate
from services.email_service import generate_otp, send_otp_email
from services.auth_service import get_password_hash
from datetime import datetime, timedelta
from typing import Optional

async def create_pending_user(email: str, password: str, full_name: Optional[str] = None) -> bool:
    """Create a pending user record (not yet verified)"""
    db = await get_database()
    
    # Delete any existing pending user with this email
    await db.pending_users.delete_many({"email": email})
    
    pending_user = {
        "email": email,
        "full_name": full_name,
        "hashed_password": get_password_hash(password),
        "created_at": datetime.utcnow()
    }
    
    await db.pending_users.insert_one(pending_user)
    return True

async def get_pending_user(email: str) -> Optional[dict]:
    """Get pending user by email"""
    db = await get_database()
    return await db.pending_users.find_one({"email": email})

async def delete_pending_user(email: str) -> bool:
    """Delete pending user after verification"""
    db = await get_database()
    result = await db.pending_users.delete_one({"email": email})
    return result.deleted_count > 0

async def store_otp(email: str, otp: str, expiry_minutes: int = 10) -> bool:
    """Store OTP in database with expiration"""
    db = await get_database()
    
    # Delete any existing OTP for this email
    await db.otps.delete_many({"email": email})
    
    otp_data = {
        "email": email,
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=expiry_minutes),
        "created_at": datetime.utcnow()
    }
    
    await db.otps.insert_one(otp_data)
    return True

async def verify_otp(email: str, otp: str) -> bool:
    """Verify OTP for email"""
    db = await get_database()
    
    otp_record = await db.otps.find_one({"email": email, "otp": otp})
    
    if not otp_record:
        return False
    
    # Check if OTP is expired
    if otp_record["expires_at"] < datetime.utcnow():
        # Delete expired OTP
        await db.otps.delete_one({"email": email})
        return False
    
    # Delete used OTP
    await db.otps.delete_one({"email": email})
    return True

async def send_verification_otp(email: str, name: Optional[str] = None) -> str:
    """Generate and send OTP to email"""
    otp = generate_otp()
    
    # Store OTP in database
    await store_otp(email, otp)
    
    # Send email
    await send_otp_email(email, otp, name)
    
    return otp

async def cleanup_expired_otps():
    """Remove expired OTPs from database"""
    db = await get_database()
    await db.otps.delete_many({"expires_at": {"$lt": datetime.utcnow()}})

async def cleanup_old_pending_users():
    """Remove pending users older than 24 hours"""
    db = await get_database()
    cutoff_time = datetime.utcnow() - timedelta(hours=24)
    await db.pending_users.delete_many({"created_at": {"$lt": cutoff_time}})
