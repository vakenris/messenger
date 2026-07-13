import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, tuple_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models.message import Message
from app.schemas.message import MessagePageResponse


router = APIRouter(
    prefix="/chats",
    tags=["messages"],
)


@router.get(
    "/{chat_id}/messages",
    response_model=MessagePageResponse,
)
async def get_message_history(
    chat_id: uuid.UUID,
    cursor: uuid.UUID | None = None,
    limit: int = Query(default=30, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
) -> MessagePageResponse:
    query = select(Message).where(Message.chat_id == chat_id)

    if cursor is not None:
        cursor_result = await session.execute(
            select(Message).where(
                Message.id == cursor,
                Message.chat_id == chat_id,
            )
        )
        cursor_message = cursor_result.scalar_one_or_none()

        if cursor_message is None:
            raise HTTPException(
                status_code=404,
                detail="Cursor message not found",
            )

        query = query.where(
            tuple_(Message.created_at, Message.id)
            < tuple_(cursor_message.created_at, cursor_message.id)
        )

    query = (
        query
        .order_by(Message.created_at.desc(), Message.id.desc())
        .limit(limit + 1)
    )

    result = await session.execute(query)
    messages = list(result.scalars().all())

    has_more = len(messages) > limit
    messages = messages[:limit]

    next_cursor = messages[-1].id if has_more and messages else None

    messages.reverse()

    return MessagePageResponse(
        items=messages,
        next_cursor=next_cursor,
        has_more=has_more,
    )


@router.get(
    "/{chat_id}/messages/search",
    response_model=MessagePageResponse,
)
async def search_messages(
    chat_id: uuid.UUID,
    q: str = Query(min_length=1, max_length=200),
    cursor: uuid.UUID | None = None,
    limit: int = Query(default=30, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
) -> MessagePageResponse:
    search_text = q.strip()

    if not search_text:
        raise HTTPException(
            status_code=422,
            detail="Search text cannot be empty",
        )

    query = select(Message).where(
        Message.chat_id == chat_id,
        Message.message.ilike(f"%{search_text}%"),
    )

    if cursor is not None:
        cursor_result = await session.execute(
            select(Message).where(
                Message.id == cursor,
                Message.chat_id == chat_id,
            )
        )
        cursor_message = cursor_result.scalar_one_or_none()

        if cursor_message is None:
            raise HTTPException(
                status_code=404,
                detail="Cursor message not found",
            )

        query = query.where(
            tuple_(Message.created_at, Message.id)
            < tuple_(cursor_message.created_at, cursor_message.id)
        )

    query = (
        query
        .order_by(Message.created_at.desc(), Message.id.desc())
        .limit(limit + 1)
    )

    result = await session.execute(query)
    messages = list(result.scalars().all())

    has_more = len(messages) > limit
    messages = messages[:limit]

    next_cursor = messages[-1].id if has_more and messages else None

    messages.reverse()

    return MessagePageResponse(
        items=messages,
        next_cursor=next_cursor,
        has_more=has_more,
    )
