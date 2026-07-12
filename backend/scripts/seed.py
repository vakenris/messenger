import os
import uuid

import bcrypt
import psycopg

DATABASE_URL = os.getenv(
    "SEED_DATABASE_URL",
    "postgresql://messenger:messenger@localhost:5432/messenger",
)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def main() -> None:
    alice_id = uuid.uuid4()
    bob_id = uuid.uuid4()
    carol_id = uuid.uuid4()

    direct_chat_id = uuid.uuid4()
    group_chat_id = uuid.uuid4()

    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("TRUNCATE messages, chat_members, chats, users CASCADE;")

            users = [
                (alice_id, "Алиса", "alice", hash_password("password123")),
                (alex_id, "Саша", "alex", hash_password("password123")),
                (sergey_id, "Сергей", "sergey", hash_password("password123")),
            ]
            cur.executemany(
                "INSERT INTO users (id, user_nick, user_name, hashed_password) "
                "VALUES (%s, %s, %s, %s);",
                users,
            )

            cur.execute(
                "INSERT INTO chats (id, type, title, created_by) "
                "VALUES (%s, 'direct', NULL, %s);",
                (direct_chat_id, alice_id),
            )
            cur.execute(
                "INSERT INTO chats (id, type, title, created_by) "
                "VALUES (%s, 'group', %s, %s);",
                (group_chat_id, "Практика ВК", alice_id),
            )

            members = [
                (direct_chat_id, alice_id, "owner"),
                (direct_chat_id, alex_id, "member"),
                (group_chat_id, alice_id, "owner"),
                (group_chat_id, alex_id, "admin"),
                (group_chat_id, sergey_id, "member"),
            ]
            cur.executemany(
                "INSERT INTO chat_members (chat_id, user_id, role) "
                "VALUES (%s, %s, %s);",
                members,
            )

            messages = [
                (uuid.uuid4(), direct_chat_id, alice_id, "Привет, Саша!"),
                (uuid.uuid4(), direct_chat_id, bob_id, "Привет, Алиса!"),
                (uuid.uuid4(), group_chat_id, alice_id, "Всем привет в группе"),
                (uuid.uuid4(), group_chat_id, carol_id, "Привет!"),
            ]
            cur.executemany(
                "INSERT INTO messages (id, chat_id, sender_id, message) "
                "VALUES (%s, %s, %s, %s);",
                messages,
            )

        conn.commit()

    print("Тестовые данные загружены:")
    print("  Пользователи: alice, alex, sergey (пароль у всех: password123)")
    print(f"  Личный чат:   {direct_chat_id}")
    print(f"  Групповой чат: {group_chat_id}")


if __name__ == "__main__":
    main()