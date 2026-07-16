from enum import StrEnum


class ChatType(StrEnum):
    DIRECT = "direct"
    GROUP = "group"


class ChatRole(StrEnum):
    MEMBER = "member"
    ADMIN = "admin"
    OWNER = "owner"
