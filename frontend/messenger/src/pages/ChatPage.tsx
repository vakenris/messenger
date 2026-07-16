import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
    getChats,
    getMe,
    getMessages,
    getWebSocketUrl,
    type Chat as ChatType,
    type Message as MessageType,
    type User,
} from "../api";
import { Chat } from "../components/Chat/Chat";
import { Sidebar } from "../components/Sidebar/Sidebar";
import "./pages.css";

export function ChatPage() {
    const navigate = useNavigate();
    const socketRef = useRef<WebSocket | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [chats, setChats] = useState<ChatType[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPage() {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const [currentUser, userChats] = await Promise.all([getMe(), getChats()]);
                setUser(currentUser);
                setChats(userChats);
                setSelectedChat(userChats[0] || null);
            } catch {
                localStorage.removeItem("token");
                navigate("/");
            }
        }

        loadPage();
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!selectedChat || !token) {
            return;
        }

        let isActive = true;

        async function loadHistory() {
            try {
                const page = await getMessages(selectedChat!.id);
                if (isActive) {
                    setMessages(page.items);
                }
            } catch (requestError) {
                if (requestError instanceof Error) {
                    setError(requestError.message);
                }
            }
        }

        loadHistory();

        const socket = new WebSocket(getWebSocketUrl(selectedChat.id, token));
        socketRef.current = socket;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "message.ack" || data.type === "message.created") {
                const newMessage = data.message as MessageType;
                setMessages((currentMessages) => {
                    const alreadyExists = currentMessages.some((message) => message.id === newMessage.id);
                    if (alreadyExists) {
                        return currentMessages;
                    }
                    return [...currentMessages, newMessage];
                });
            }

            if (data.type === "error") {
                setError(data.detail);
            }
        };

        socket.onerror = () => {
            setError("Не удалось подключиться к чату");
        };

        return () => {
            isActive = false;
            socket.close();
            socketRef.current = null;
        };
    }, [selectedChat]);

    function sendMessage(text: string) {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            setError("Соединение с чатом ещё не установлено");
            return false;
        }

        socket.send(JSON.stringify({
            type: "message.send",
            dedup_key: crypto.randomUUID(),
            message: text,
        }));
        return true;
    }

    function selectChat(chat: ChatType) {
        setMessages([]);
        setError("");
        setSelectedChat(chat);
    }

    async function searchMessages(search: string) {
        if (!selectedChat) {
            return;
        }

        try {
            const page = await getMessages(selectedChat.id, search);
            setMessages(page.items);
        } catch (requestError) {
            if (requestError instanceof Error) {
                setError(requestError.message);
            }
        }
    }

    function logout() {
        localStorage.removeItem("token");
        socketRef.current?.close();
        navigate("/");
    }

    return (
        <main className="chat-page">
            <Sidebar
                chats={chats}
                selectedChatId={selectedChat?.id || null}
                onSelectChat={selectChat}
                onLogout={logout}
                userName={user?.user_nick || ""}
            />
            <Chat
                chat={selectedChat}
                messages={messages}
                currentUserId={user?.id || ""}
                error={error}
                onSend={sendMessage}
                onSearch={searchMessages}
            />
        </main>
    );
}
