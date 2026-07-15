from uuid import UUID

from fastapi import WebSocket, WebSocketDisconnect


class ConnectionManager:
    """Stores active WebSocket connections grouped by chat."""

    def __init__(self) -> None:
        self.active_connections: dict[UUID, set[WebSocket]] = {}

    async def connect(self, chat_id: UUID, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.setdefault(chat_id, set()).add(websocket)

    def disconnect(self, chat_id: UUID, websocket: WebSocket) -> None:
        connections = self.active_connections.get(chat_id)
        if connections is None:
            return

        connections.discard(websocket)
        if not connections:
            self.active_connections.pop(chat_id, None)

    async def broadcast(
        self,
        chat_id: UUID,
        data: dict,
        exclude: WebSocket | None = None,
    ) -> None:
        connections = list(self.active_connections.get(chat_id, set()))

        for websocket in connections:
            if websocket is exclude:
                continue

            try:
                await websocket.send_json(data)
            except WebSocketDisconnect:
                self.disconnect(chat_id, websocket)


connection_manager = ConnectionManager()
