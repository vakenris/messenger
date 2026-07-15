import uuid

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.connections import connection_manager
from app.database import get_session
from app.models.message import Message
from app.schemas.message import MessageResponse
from app.schemas.websocket import WebSocketMessageIn


router = APIRouter(tags=["websocket"])


async def save_message(
    session: AsyncSession,
    chat_id: uuid.UUID,
    data: WebSocketMessageIn,
) -> tuple[Message, bool]:
    """Save a message and return (message, was_created)."""

    existing_result = await session.execute(
        select(Message).where(
            Message.chat_id == chat_id,
            Message.dedup_key == data.dedup_key,
        )
    )
    existing_message = existing_result.scalar_one_or_none()

    if existing_message is not None:
        return existing_message, False

    message = Message(
        chat_id=chat_id,
        sender_id=data.sender_id,
        dedup_key=data.dedup_key,
        message=data.message,
    )
    session.add(message)

    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()

        duplicate_result = await session.execute(
            select(Message).where(
                Message.chat_id == chat_id,
                Message.dedup_key == data.dedup_key,
            )
        )
        duplicate_message = duplicate_result.scalar_one_or_none()
        if duplicate_message is None:
            raise

        return duplicate_message, False

    await session.refresh(message)
    return message, True


@router.websocket("/ws/chats/{chat_id}")
async def chat_websocket(
    websocket: WebSocket,
    chat_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    await connection_manager.connect(chat_id, websocket)

    try:
        while True:
            raw_data = await websocket.receive_json()

            try:
                data = WebSocketMessageIn.model_validate(raw_data)
            except ValidationError:
                await websocket.send_json(
                    {
                        "type": "error",
                        "detail": "Invalid message format",
                    }
                )
                continue

            saved_message, was_created = await save_message(
                session=session,
                chat_id=chat_id,
                data=data,
            )
            message_data = MessageResponse.model_validate(saved_message).model_dump(
                mode="json"
            )

            await websocket.send_json(
                {
                    "type": "message.ack",
                    "duplicate": not was_created,
                    "message": message_data,
                }
            )

            if was_created:
                await connection_manager.broadcast(
                    chat_id=chat_id,
                    data={
                        "type": "message.created",
                        "message": message_data,
                    },
                    exclude=websocket,
                )

    except WebSocketDisconnect:
        pass
    finally:
        connection_manager.disconnect(chat_id, websocket)
