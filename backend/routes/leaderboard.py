from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional
from bson import ObjectId

from models.user import UserInDB
from models.form_entry import FormEntryResponse
from routes.auth import get_current_user
from config.database import get_database
from config.settings import settings

router = APIRouter()

# Request/Response Models
class UpdateScoreRequest(BaseModel):
    score: float

class LeaderboardEntry(BaseModel):
    id: str
    user_name: Optional[str]
    user_email: str
    responses: dict
    submitted_at: str
    score: Optional[float]
    rank: Optional[int] = None

# Helper function to check if user is admin
def is_admin(user: UserInDB) -> bool:
    admin_emails = [email.strip() for email in settings.ADMIN_EMAILS.split(',') if email.strip()]
    return user.email in admin_emails

# Dependency to verify admin access
async def require_admin(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

@router.get("/leaderboard/{form_id}")
async def get_leaderboard(form_id: str):
    """Get public leaderboard - only entries with scores"""
    db = await get_database()
    
    # Verify form exists and has leaderboard enabled
    form_doc = await db.forms.find_one({"id": form_id})
    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    
    if not form_doc.get("leaderboard", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Leaderboard not enabled for this form"
        )
    
    # Get all entries with non-null scores, sorted by score descending
    cursor = db.form_entries.find({
        "form_id": form_id,
        "score": {"$ne": None}
    }).sort("score", -1)
    
    entries = []
    rank = 1
    async for entry in cursor:
        entries.append(LeaderboardEntry(
            id=str(entry["_id"]),
            user_name=entry.get("user_name"),
            user_email=entry["user_email"],
            responses=entry["responses"],
            submitted_at=entry["submitted_at"].isoformat(),
            score=entry.get("score"),
            rank=rank
        ))
        rank += 1
    
    return {
        "form_id": form_id,
        "form_name": form_doc["name"],
        "entries": entries,
        "total_count": len(entries)
    }

@router.get("/leaderboard/{form_id}/admin")
async def get_admin_leaderboard(
    form_id: str,
    current_user: UserInDB = Depends(require_admin)
):
    """Get admin leaderboard - all entries with editable scores"""
    db = await get_database()
    
    # Verify form exists
    form_doc = await db.forms.find_one({"id": form_id})
    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    
    if not form_doc.get("leaderboard", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Leaderboard not enabled for this form"
        )
    
    # Get all entries for this form, sorted by submission time
    cursor = db.form_entries.find({
        "form_id": form_id
    }).sort("submitted_at", -1)
    
    entries = []
    async for entry in cursor:
        entries.append(LeaderboardEntry(
            id=str(entry["_id"]),
            user_name=entry.get("user_name"),
            user_email=entry["user_email"],
            responses=entry["responses"],
            submitted_at=entry["submitted_at"].isoformat(),
            score=entry.get("score")
        ))
    
    return {
        "form_id": form_id,
        "form_name": form_doc["name"],
        "questions": form_doc.get("questions", []),
        "entries": entries,
        "total_count": len(entries)
    }

@router.patch("/leaderboard/{form_id}/entry/{entry_id}/score")
async def update_entry_score(
    form_id: str,
    entry_id: str,
    score_update: UpdateScoreRequest,
    current_user: UserInDB = Depends(require_admin)
):
    """Update score for a specific entry (admin only)"""
    db = await get_database()
    
    # Verify form exists
    form_doc = await db.forms.find_one({"id": form_id})
    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    
    # Verify entry exists and belongs to the form
    try:
        entry_object_id = ObjectId(entry_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid entry ID"
        )
    
    entry = await db.form_entries.find_one({
        "_id": entry_object_id,
        "form_id": form_id
    })
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    # Update the score
    result = await db.form_entries.update_one(
        {"_id": entry_object_id},
        {"$set": {"score": score_update.score}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update score"
        )
    
    return {
        "message": "Score updated successfully",
        "entry_id": entry_id,
        "score": score_update.score
    }

@router.get("/forms-with-leaderboard")
async def get_forms_with_leaderboard():
    """Get list of all forms that have leaderboard enabled"""
    db = await get_database()
    
    cursor = db.forms.find({"leaderboard": True})
    forms = []
    async for form in cursor:
        forms.append({
            "id": form["id"],
            "name": form["name"],
            "type": form["type"]
        })
    
    return {
        "forms": forms,
        "count": len(forms)
    }
