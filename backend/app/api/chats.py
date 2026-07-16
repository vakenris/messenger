from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from app.database import get_db
from app.models import Chat, ChatMember, User, ChatType, ChatRole
from app.schemas import ChatCreate, ChatOut
from app.auth import get_current_user_db

router = APIRouter(prefix="/chats", tags=["chats"])

@router.post("", response_model=ChatOut, status_code=status.HTTP_201_CREATED)
def create_chat(
    chat_data: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db)
):
    new_chat = Chat(name=chat_data.name, type=chat_data.type)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    creator_role = ChatRole.ADMIN if chat_data.type == ChatType.GROUP else ChatRole.MEMBER
    db.add(ChatMember(chat_id=new_chat.id, user_id=current_user.id, role=creator_role))

    for uid in chat_data.invited_user_ids:
        invited_user = db.query(User).filter_by(id=uid).first()
        if invited_user and uid != current_user.id:
            db.add(ChatMember(chat_id=new_chat.id, user_id=uid, role=ChatRole.MEMBER))
            
    db.commit()
    return new_chat


@router.get("", response_model=List[ChatOut])
def get_user_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db)
):
    stmt = select(Chat).join(ChatMember).where(ChatMember.user_id == current_user.id)
    return db.scalars(stmt).all()


@router.post("/{chat_id}/members", status_code=status.HTTP_201_CREATED)
def add_member(
    chat_id: int,
    user_id_to_add: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db)
):
    actor = db.query(ChatMember).filter_by(chat_id=chat_id, user_id=current_user.id).first()
    if not actor or actor.role != ChatRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Добавлять участников может только администратор чата"
        )

    user_to_add = db.query(User).filter_by(id=user_id_to_add).first()
    if not user_to_add:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    existing = db.query(ChatMember).filter_by(chat_id=chat_id, user_id=user_id_to_add).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь уже состоит в этом чате")

    db.add(ChatMember(chat_id=chat_id, user_id=user_id_to_add, role=ChatRole.MEMBER))
    db.commit()
    return {"message": "Участник успешно добавлен"}


@router.delete("/{chat_id}/members/{user_id}", status_code=status.HTTP_200_OK)
def remove_member(
    chat_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_db)
):
    actor = db.query(ChatMember).filter_by(chat_id=chat_id, user_id=current_user.id).first()
    if not actor or actor.role != ChatRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Удалять участников может только администратор чата"
        )

    member_to_remove = db.query(ChatMember).filter_by(chat_id=chat_id, user_id=user_id).first()
    if not member_to_remove:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Участник не найден в данном чате")

    db.delete(member_to_remove)
    db.commit()
    return {"message": "Участник успешно удален"}