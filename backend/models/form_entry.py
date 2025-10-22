from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type='string', example='abc')
        return json_schema

class FormEntryCreate(BaseModel):
    form_id: str
    user_id: str
    responses: Dict[str, str]

class FormEntryInDB(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    form_id: str
    user_id: str
    user_email: str
    user_name: Optional[str] = None
    responses: Dict[str, str]
    submitted_at: datetime
    score: Optional[float] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class FormEntryResponse(BaseModel):
    id: str
    form_id: str
    user_id: str
    user_email: str
    user_name: Optional[str] = None
    responses: Dict[str, str]
    submitted_at: datetime
    score: Optional[float] = None
