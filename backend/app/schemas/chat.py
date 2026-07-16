from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.enums import ChatType

class ChatCreate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    type: ChatType
    invited_user_ids: List[int] = []

class ChatOut(BaseModel):
    id: int
    name: Optional[str]
    type: ChatType
    created_at: datetime

    class Config:
        from_attributes = True