import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.database import get_session
from app.models.chat import Chat
from app.models.chat_member import ChatMember
from app.models.enums import ChatRole, ChatType
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatOut

router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("", response_model=ChatOut, status_code=status.HTTP_201_CREATED)
async def create_chat(
    data: ChatCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Chat:
    invited_ids = set(data.invited_user_ids)
    invited_ids.discard(current_user.id)

    if data.type == ChatType.DIRECT and len(invited_ids) != 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Direct chat requires exactly one invited user",
        )

    if invited_ids:
        result = await session.execute(select(User.id).where(User.id.in_(invited_ids)))
        existing_ids = set(result.scalars().all())
        missing_ids = invited_ids - existing_ids
        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or more invited users were not found",
            )

    chat = Chat(
        title=data.title,
        type=data.type,
        created_by=current_user.id,
    )
    session.add(chat)
    await session.flush()

    session.add(
        ChatMember(chat_id=chat.id, user_id=current_user.id, role=ChatRole.OWNER)
    )
    session.add_all(
        ChatMember(chat_id=chat.id, user_id=user_id, role=ChatRole.MEMBER)
        for user_id in invited_ids
    )
    await session.commit()
    await session.refresh(chat)
    return chat


@router.get("", response_model=list[ChatOut])
async def get_user_chats(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> list[Chat]:
    result = await session.execute(
        select(Chat)
        .join(ChatMember, ChatMember.chat_id == Chat.id)
        .where(ChatMember.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
    )
    return list(result.scalars().all())


@router.post("/{chat_id}/members", status_code=status.HTTP_201_CREATED)
async def add_member(
    chat_id: uuid.UUID,
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    actor_result = await session.execute(
        select(ChatMember).where(
            ChatMember.chat_id == chat_id,
            ChatMember.user_id == current_user.id,
        )
    )
    actor = actor_result.scalar_one_or_none()
    if actor is None or actor.role not in (ChatRole.OWNER, ChatRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only a chat owner or admin can add members",
        )

    user = await session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    existing = await session.get(ChatMember, (chat_id, user_id))
    if existing is not None:
        raise HTTPException(status_code=409, detail="User is already a chat member")

    session.add(ChatMember(chat_id=chat_id, user_id=user_id, role=ChatRole.MEMBER))
    await session.commit()
    return {"message": "Member added"}


@router.delete("/{chat_id}/members/{user_id}")
async def remove_member(
    chat_id: uuid.UUID,
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    actor = await session.get(ChatMember, (chat_id, current_user.id))
    if actor is None or actor.role not in (ChatRole.OWNER, ChatRole.ADMIN):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only a chat owner or admin can remove members",
        )

    member = await session.get(ChatMember, (chat_id, user_id))
    if member is None:
        raise HTTPException(status_code=404, detail="Chat member not found")
    if member.role == ChatRole.OWNER:
        raise HTTPException(status_code=409, detail="Chat owner cannot be removed")

    await session.delete(member)
    await session.commit()
    return {"message": "Member removed"}
