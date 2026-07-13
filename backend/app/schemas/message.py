import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    chat_id: uuid.UUID
    sender_id: uuid.UUID
    dedup_key: uuid.UUID | None = None
    message: str
    created_at: datetime


class MessagePageResponse(BaseModel):
    items: list[MessageResponse]
    next_cursor: uuid.UUID | None = None
    has_more: bool
