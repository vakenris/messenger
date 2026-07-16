import uuid
from typing import Literal

from pydantic import BaseModel, Field


class WebSocketMessageIn(BaseModel):
    """Data sent by a client when it wants to create a message."""

    type: Literal["message.send"] = "message.send"
    dedup_key: uuid.UUID
    message: str = Field(min_length=1, max_length=10_000)
