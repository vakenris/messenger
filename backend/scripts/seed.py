import os
import uuid

import bcrypt
import psycopg

DATABASE_URL = os.getenv(
    "SEED_DATABASE_URL",
    "postgresql://messenger:messenger@localhost:5432/messenger",
)

ALICE_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")
ALEX_ID = uuid.UUID("00000000-0000-0000-0000-000000000002")
SERGEY_ID = uuid.UUID("00000000-0000-0000-0000-000000000003")
DIRECT_CHAT_ID = uuid.UUID("10000000-0000-0000-0000-000000000001")
GROUP_CHAT_ID = uuid.UUID("10000000-0000-0000-0000-000000000002")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def main() -> None:
    password_hash = hash_password("password123")

    with psycopg.connect(DATABASE_URL) as connection:
        with connection.cursor() as cursor:
            users = [
                (ALICE_ID, "Алиса", "alice", password_hash),
                (ALEX_ID, "Саша", "alex", password_hash),
                (SERGEY_ID, "Сергей", "sergey", password_hash),
            ]
            cursor.executemany(
                "INSERT INTO users (id, user_nick, user_name, hashed_password) "
                "VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (id) DO NOTHING",
                users,
            )

            chats = [
                (DIRECT_CHAT_ID, "direct", None, ALICE_ID),
                (GROUP_CHAT_ID, "group", "Практика ВК", ALICE_ID),
            ]
            cursor.executemany(
                "INSERT INTO chats (id, type, title, created_by) "
                "VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (id) DO NOTHING",
                chats,
            )

            members = [
                (DIRECT_CHAT_ID, ALICE_ID, "owner"),
                (DIRECT_CHAT_ID, ALEX_ID, "member"),
                (GROUP_CHAT_ID, ALICE_ID, "owner"),
                (GROUP_CHAT_ID, ALEX_ID, "admin"),
                (GROUP_CHAT_ID, SERGEY_ID, "member"),
            ]
            cursor.executemany(
                "INSERT INTO chat_members (chat_id, user_id, role) "
                "VALUES (%s, %s, %s) "
                "ON CONFLICT (chat_id, user_id) DO NOTHING",
                members,
            )

            messages = [
                (
                    uuid.UUID("20000000-0000-0000-0000-000000000001"),
                    DIRECT_CHAT_ID,
                    ALICE_ID,
                    "Привет, Саша!",
                ),
                (
                    uuid.UUID("20000000-0000-0000-0000-000000000002"),
                    DIRECT_CHAT_ID,
                    ALEX_ID,
                    "Привет, Алиса!",
                ),
                (
                    uuid.UUID("20000000-0000-0000-0000-000000000003"),
                    GROUP_CHAT_ID,
                    ALICE_ID,
                    "Всем привет в группе",
                ),
                (
                    uuid.UUID("20000000-0000-0000-0000-000000000004"),
                    GROUP_CHAT_ID,
                    SERGEY_ID,
                    "Привет!",
                ),
            ]
            cursor.executemany(
                "INSERT INTO messages (id, chat_id, sender_id, message) "
                "VALUES (%s, %s, %s, %s) "
                "ON CONFLICT (id) DO NOTHING",
                messages,
            )

        connection.commit()

    print("Seed completed.")
    print("Users: alice, alex, sergey; password: password123")
    print(f"Direct chat: {DIRECT_CHAT_ID}")
    print(f"Group chat:  {GROUP_CHAT_ID}")


if __name__ == "__main__":
    main()
