import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ChatType

class ChatCreate(BaseModel):
    title: str | None = Field(None, max_length=255)
    type: ChatType
    invited_user_ids: list[uuid.UUID] = Field(default_factory=list)

class ChatOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str | None
    type: ChatType
    created_by: uuid.UUID
    created_at: datetime
