from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional

import pytz
from models.user import UserCreate, UserResponse, Token, UserInDB
from services.user_service import (
    get_user_by_email,
    get_user_by_id,
    create_user,
    get_user_by_google_id,
    create_google_user
)
from services.auth_service import (
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    get_password_hash
)
from services.otp_service import (
    create_pending_user,
    get_pending_user,
    delete_pending_user,
    send_verification_otp,
    verify_otp
)
from config.database import get_database
from config.settings import settings
import httpx
from datetime import timedelta, datetime
import urllib.parse

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Request/Response Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupInitiateRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class SignupVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class ResendOTPRequest(BaseModel):
    email: EmailStr

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    token: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordInitiateRequest(BaseModel):
    email: EmailStr

class ForgotPasswordVerifyRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    """Get current authenticated user"""
    token_data = verify_token(token, "access")
    
    if token_data is None or token_data.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await get_user_by_id(token_data.user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

# Routes
@router.post("/signup/initiate", status_code=status.HTTP_200_OK)
async def signup_initiate(request: SignupInitiateRequest):
    """Initiate signup process - send OTP to email"""
    # Check if user already exists
    existing_user = await get_user_by_email(request.email)
    if existing_user:
        # Check if user has password (email signup) or not (Google signup)
        if existing_user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            # User signed up with Google
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is registered with Google. Please sign in with Google."
            )
    
    # Validate password
    if len(request.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Create pending user
    await create_pending_user(request.email, request.password, request.full_name)
    
    # Send OTP
    await send_verification_otp(request.email, request.full_name)
    
    return {"message": "OTP sent to email", "email": request.email}

@router.post("/signup/verify", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup_verify(request: SignupVerifyRequest):
    """Verify OTP and create user account"""
    # Verify OTP
    is_valid = await verify_otp(request.email, request.otp)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Get pending user
    pending_user = await get_pending_user(request.email)
    
    if not pending_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pending user not found. Please restart signup process."
        )
    
    # Check if user was created in the meantime
    existing_user = await get_user_by_email(request.email)
    if existing_user:
        await delete_pending_user(request.email)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create actual user from pending user
    db = await get_database()
    
    user_dict = {
        "email": pending_user["email"],
        "full_name": pending_user.get("full_name"),
        "hashed_password": pending_user["hashed_password"],
        "is_active": True,
        "is_verified": True,  # Email verified via OTP
        "created_at": datetime.now(tz = pytz.timezone('Asia/Kolkata')),
        "updated_at": datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    user = UserInDB(**user_dict)
    
    # Delete pending user
    await delete_pending_user(request.email)
    
    # Create tokens
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/signup/resend-otp", status_code=status.HTTP_200_OK)
async def resend_otp(request: ResendOTPRequest):
    """Resend OTP to email"""
    # Check if there's a pending user
    pending_user = await get_pending_user(request.email)
    
    if not pending_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No pending signup found for this email"
        )
    
    # Send new OTP
    await send_verification_otp(request.email, pending_user.get("full_name"))
    
    return {"message": "OTP resent to email"}

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest):
    """Register a new user (legacy endpoint - without email verification)"""
    # Check if user already exists
    existing_user = await get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_data = UserCreate(
        email=request.email,
        password=request.password,
        full_name=request.full_name
    )
    user = await create_user(user_data)
    
    # Create tokens
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    """Login with email and password"""
    # Get user
    user = await get_user_by_email(request.email)
    
    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user has a password (email signup) or signed up with Google
    if not user.hashed_password:
        # User signed up with Google
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account was created using Google Sign-In. Please sign in with Google."
        )
    
    # Verify password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive"
        )
    
    # Create tokens
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.post("/google", response_model=Token)
async def google_auth(request: GoogleAuthRequest):
    """Authenticate with Google OAuth token"""
    try:
        # Verify Google token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={urllib.parse.quote(request.token)}"
            )

            user_info = await client.get(
                f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={urllib.parse.quote(request.token)}"
            )
            
            if response.status_code != 200 or user_info.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Google token"
                )
            
            google_data = response.json()
            user_info_data = user_info.json()
            
            # Verify audience (client ID)
            if google_data.get("aud") != settings.GOOGLE_CLIENT_ID:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token audience"
                )

            google_id = google_data.get("sub")
            email = google_data.get("email")
            name = user_info_data.get("name")
            # picture = google_data.get("picture")
            picture = user_info_data.get("picture")

            if not google_id or not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid Google token data"
                )

            # Check if user exists
            user = await get_user_by_google_id(google_id)
            
            if not user:
                # Check if email is already registered
                user = await get_user_by_email(email)
                
                if user:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already registered with different method"
                    )
                
                # Create new user
                user = await create_google_user(
                    email=email,
                    google_id=google_id,
                    full_name=name,
                    profile_picture=picture
                )
            
            # Create tokens
            access_token = create_access_token(
                data={"sub": user.email, "user_id": str(user.id)}
            )
            refresh_token = create_refresh_token(
                data={"sub": user.email, "user_id": str(user.id)}
            )
            
            return Token(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer"
            )
            
    except httpx.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to verify Google token"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token"""
    token_data = verify_token(request.refresh_token, "refresh")
    
    if token_data is None or token_data.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user = await get_user_by_id(token_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens
    access_token = create_access_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    new_refresh_token = create_refresh_token(
        data={"sub": user.email, "user_id": str(user.id)}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        token_type="bearer"
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserInDB = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        _id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        profile_picture=current_user.profile_picture,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

@router.post("/logout")
async def logout(current_user: UserInDB = Depends(get_current_user)):
    """Logout user (client should delete tokens)"""
    return {"message": "Successfully logged out"}

@router.post("/forgot-password/initiate", status_code=status.HTTP_200_OK)
async def forgot_password_initiate(request: ForgotPasswordInitiateRequest):
    """Initiate forgot password process - send OTP to email"""
    # Check if user exists
    existing_user = await get_user_by_email(request.email)
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email"
        )
    
    # Check if user signed up with Google (no password)
    if not existing_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google Sign-In. Password reset is not available."
        )
    
    # Send OTP
    success = await send_verification_otp(request.email)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )
    
    return {
        "message": "OTP sent to email",
        "email": request.email
    }

@router.post("/forgot-password/verify", status_code=status.HTTP_200_OK)
async def forgot_password_verify(request: ForgotPasswordVerifyRequest):
    """Verify OTP and reset password"""
    # Verify OTP
    is_valid = await verify_otp(request.email, request.otp)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    
    # Get user
    user = await get_user_by_email(request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    db = await get_database()
    hashed_password = get_password_hash(request.new_password)
    
    await db.users.update_one(
        {"email": request.email},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    # Delete the OTP
    await db.otps.delete_many({"email": request.email})
    
    return {
        "message": "Password reset successful",
        "email": request.email
    }

@router.post("/forgot-password/resend-otp", status_code=status.HTTP_200_OK)
async def forgot_password_resend_otp(request: ResendOTPRequest):
    """Resend OTP for forgot password"""
    # Check if user exists
    existing_user = await get_user_by_email(request.email)
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this email"
        )
    
    # Check if user signed up with Google
    if not existing_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google Sign-In. Password reset is not available."
        )
    
    # Send new OTP
    success = await send_verification_otp(request.email)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )
    
    return {
        "message": "New OTP sent to email",
        "email": request.email
    }