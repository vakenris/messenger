from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.chats import router as chats_router
from app.api.messages import router as messages_router
from app.api.ws import router as websocket_router

app = FastAPI(
    title="Keducation Messenger API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chats_router)
app.include_router(messages_router)
app.include_router(websocket_router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Keducation Messenger API"}
