import datetime
from typing import List, Optional
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.enums import ChatType

class Chat(Base):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    type: Mapped[ChatType] = mapped_column(String, default=ChatType.DIRECT)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    messages: Mapped[List["Message"]] = relationship(back_populates="chat", cascade="all, delete-orphan")
    members: Mapped[List["ChatMember"]] = relationship(back_populates="chat", cascade="all, delete-orphan")