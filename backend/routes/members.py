"""
Members routes for fetching team member data
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Literal, Optional
from services.google_sheets_service import google_sheets_service

router = APIRouter()

@router.get("/members")
async def get_members(team: Optional[Literal['rc', 'drones']] = None) -> List[Dict[str, Any]]:
    """
    Fetch all team members from Google Sheets
    """
    try:
        members = await google_sheets_service.fetch_team_members(sheet_name='Form Responses 1')

        if team:
            if team == 'rc':
                members = [m for m in members if m.get('role', '').lower() == 'rc planes']
            elif team == 'drones':
                members = [m for m in members if m.get('role', '').lower() == 'drones']

        return members
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/members/count")
async def get_members_count(team: Optional[Literal['rc', 'drones']] = None) -> Dict[str, int]:
    """
    Get the count of team members
    """
    try:
        members = await google_sheets_service.fetch_team_members(sheet_name='Form Responses 1')

        if team:
            if team == 'rc':
                members = [m for m in members if m.get('role', '').lower() == 'rc planes']
            elif team == 'drones':
                members = [m for m in members if m.get('role', '').lower() == 'drones']

        return {"count": len(members)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
