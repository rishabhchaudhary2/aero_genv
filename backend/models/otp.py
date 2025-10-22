from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

import pytz

class OTPCreate(BaseModel):
    email: EmailStr
    otp: str
    expires_at: datetime

class OTPInDB(BaseModel):
    email: EmailStr
    otp: str
    expires_at: datetime
    created_at: datetime = datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    
class PendingUserCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    hashed_password: str
    created_at: datetime = datetime.now(tz = pytz.timezone('Asia/Kolkata'))
