from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional, Literal, Dict
from datetime import datetime, timezone

import pytz
from models.form_entry import FormEntryCreate, FormEntryInDB, FormEntryResponse
from models.form_draft import FormDraftCreate, FormDraftInDB, FormDraftResponse
from models.user import UserInDB
from routes.auth import get_current_user
from config.database import get_database
from services.google_sheets_service import google_sheets_service

router = APIRouter()

# Response Models
class QuestionOption(BaseModel):
    question_key: str
    question_text: str
    question_type: Literal["short", "long", "radio"]
    options: Optional[List[str]] = None

class FormResponse(BaseModel):
    id: str
    name: str
    type: Literal["solo", "team"]
    opening_time: datetime
    closing_time: datetime
    questions: List[QuestionOption]
    redirect_to: Optional[str] = None
    leaderboard: Optional[bool] = False

@router.get("/forms/{form_id}", response_model=FormResponse)
async def get_form(form_id: str):
    """Get form data by ID"""
    db = await get_database()
    form_doc = await db.forms.find_one({"id": form_id})
    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    
    return FormResponse(
        id=form_doc["id"],
        name=form_doc["name"],
        type=form_doc["type"],
        opening_time=form_doc["opening_time"],
        closing_time=form_doc["closing_time"],
        questions=form_doc["questions"],
        redirect_to=form_doc.get("redirect_to")
    )

@router.get("/forms/{form_id}/check-submission")
async def check_submission(form_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Check if current user has already submitted this form"""
    db = await get_database()
    form_doc = await db.forms.find_one({"id": form_id})

    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )

    # Check if user has already submitted this form
    existing_entry = await db.form_entries.find_one({
        "form_id": form_id,
        "user_id": str(current_user.id)
    })
    
    return {
        "has_submitted": existing_entry is not None,
        "submission": {
            "id": str(existing_entry["_id"]),
            "submitted_at": existing_entry["submitted_at"].isoformat()
        } if existing_entry else None
    }

@router.post("/forms/{form_id}/submit", status_code=status.HTTP_201_CREATED)
async def submit_form(
    form_id: str,
    submission: FormEntryCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Submit a form response"""
    # Validate form exists
    db = await get_database()
    form_data = await db.forms.find_one({"id": form_id})

    if not form_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    
    # Validate time window
    now = datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    opening: datetime = form_data["opening_time"].replace(tzinfo=pytz.timezone('Asia/Kolkata'))
    closing: datetime = form_data["closing_time"].replace(tzinfo=pytz.timezone('Asia/Kolkata'))

    if now < opening:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Form is not yet open"
        )
    
    if now > closing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Form is closed"
        )
    
    db = await get_database()
    
    # Check for duplicate submission
    existing_entry = await db.form_entries.find_one({
        "form_id": form_id,
        "user_id": str(current_user.id)
    })
    
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already submitted this form"
        )
    
    # Validate all required questions are answered
    required_questions = {q["question_key"] for q in form_data["questions"]}
    provided_questions = set(submission.responses.keys())
    
    missing_questions = required_questions - provided_questions
    if missing_questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required questions: {', '.join(missing_questions)}"
        )
    
    # Create form entry
    entry_data = {
        "form_id": form_id,
        "user_id": str(current_user.id),
        "user_email": current_user.email,
        "user_name": current_user.full_name,
        "responses": submission.responses,
        "submitted_at": now
    }
    
    result = await db.form_entries.insert_one(entry_data)

    # Clean and renumber team member data if form is team type
    cleaned_responses = dict(submission.responses)
    if form_data["type"] == "team":
        # Find which team members have data
        members_with_data = []
        for i in range(2, 5):  # Check team members 2, 3, 4
            fields = ['name', 'roll', 'phone']
            has_data = any(
                cleaned_responses.get(f"team_member_{i}_{field}")
                for field in fields
            )
            if has_data:
                members_with_data.append(i)
        
        # Renumber team members sequentially
        if members_with_data:
            # Create a new responses dict with renumbered team members
            temp_responses = {}
            
            # Copy non-team-member responses
            for key, value in cleaned_responses.items():
                if not key.startswith('team_member_'):
                    temp_responses[key] = value
            
            # Renumber team members
            for index, old_num in enumerate(members_with_data):
                new_num = index + 2  # Start from 2
                fields = ['name', 'roll', 'phone']
                for field in fields:
                    old_key = f"team_member_{old_num}_{field}"
                    new_key = f"team_member_{new_num}_{field}"
                    if old_key in cleaned_responses:
                        temp_responses[new_key] = cleaned_responses[old_key]
            
            cleaned_responses = temp_responses
        
        # Add questions for team members that have data
        new_questions = lambda i: [
            {"question_key": f"team_member_{i}_name", "question_text": f"Team member {i} name", "question_type": "short"},
            {"question_key": f"team_member_{i}_roll", "question_text": f"Team member {i} roll number", "question_type": "short"},
            {"question_key": f"team_member_{i}_phone", "question_text": f"Team member {i} phone", "question_type": "short"},
        ]

        for i in range(2, 5):  # team members 2 to 4
            form_data["questions"].extend(new_questions(i))
    
    # Push to Google Sheets with cleaned responses
    try:
        await google_sheets_service.append_form_submission(
            form_name=form_data["name"],
            user_name=current_user.full_name,
            user_email=current_user.email,
            questions=form_data["questions"],
            responses=cleaned_responses,
            timestamp=now
        )
    except Exception as e:
        # Log the error but don't fail the submission
        print(f"Warning: Failed to push form submission to Google Sheets: {str(e)}")
    
    # Delete draft after successful submission
    await db.form_drafts.delete_one({
        "form_id": form_id,
        "user_id": str(current_user.id)
    })
    
    return {
        "message": "Form submitted successfully",
        "submission_id": str(result.inserted_id),
        "submitted_at": now.isoformat(),
        "redirect_to": form_data.get("redirect_to")
    }

@router.get("/forms/{form_id}/draft")
async def get_draft(form_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Get saved draft for a form"""
    db = await get_database()
    
    # Check if form exists
    form_doc = await db.forms.find_one({"id": form_id})
    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    
    # Get draft
    draft = await db.form_drafts.find_one({
        "form_id": form_id,
        "user_id": str(current_user.id)
    })
    
    if not draft:
        return {
            "has_draft": False,
            "draft": None
        }
    
    return {
        "has_draft": True,
        "draft": {
            "id": str(draft["_id"]),
            "form_id": draft["form_id"],
            "responses": draft["responses"],
            "last_saved": draft["last_saved"].isoformat()
        }
    }

@router.post("/forms/{form_id}/draft")
async def save_draft(
    form_id: str,
    draft: FormDraftCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Save or update draft for a form"""
    db = await get_database()
    
    # Check if form exists
    form_doc = await db.forms.find_one({"id": form_id})
    if not form_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Form with id '{form_id}' not found"
        )
    now = datetime.now(tz = pytz.timezone('Asia/Kolkata'))
    
    # Check if user already submitted this form
    existing_entry = await db.form_entries.find_one({
        "form_id": form_id,
        "user_id": str(current_user.id)
    })
    
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Form already submitted, cannot save draft"
        )
    
    # Upsert draft (update if exists, insert if not)
    draft_data = {
        "form_id": form_id,
        "user_id": str(current_user.id),
        "responses": draft.responses,
        "last_saved": now
    }
    
    result = await db.form_drafts.update_one(
        {
            "form_id": form_id,
            "user_id": str(current_user.id)
        },
        {"$set": draft_data},
        upsert=True
    )
    
    return {
        "message": "Draft saved successfully",
        "last_saved": now.isoformat()
    }

@router.delete("/forms/{form_id}/draft")
async def delete_draft(form_id: str, current_user: UserInDB = Depends(get_current_user)):
    """Delete saved draft for a form"""
    db = await get_database()
    
    result = await db.form_drafts.delete_one({
        "form_id": form_id,
        "user_id": str(current_user.id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No draft found"
        )
    
    return {
        "message": "Draft deleted successfully"
    }
