# Messenger

## Запуск через Docker

1. При необходимости скопируйте `.env.example` в `.env` и замените
   `JWT_SECRET`.
2. Запустите весь проект:

   ```bash
   docker compose up --build
   ```

После запуска доступны:

- frontend через общий Nginx: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- API через общий reverse proxy: http://localhost:3000/api
- WebSocket через общий reverse proxy: `ws://localhost:3000/ws/chats/{chat_id}?token={token}`

PostgreSQL при первом запуске автоматически получает схему из
`backend/scripts/init_db.sql`. Сервис `seed` после готовности базы добавляет
демонстрационных пользователей, чаты и сообщения. Seed идемпотентный и не
удаляет данные при повторном запуске.

Демонстрационные пользователи: `alice`, `alex`, `sergey`. Пароль для всех:
`password123`.

Остановить проект:

```bash
docker compose down
```

Удалить базу и создать её заново при следующем запуске:

```bash
docker compose down -v
```
