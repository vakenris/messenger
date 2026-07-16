import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deleteChat, getChats, getMe, getMessages, getWebSocketUrl, type Chat as ChatType, type Message as MessageType, type User } from "../api";
import { Chat } from "../components/Chat/Chat";
import { ManageMembers } from "../components/Model/ManageMembers";
import { Sidebar } from "../components/Sidebar/Sidebar";
import "./pages.css";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

function addIncomingMessage(current: MessageType[], incoming: MessageType) {
    let pendingIndex = -1;
    if (incoming.dedup_key) {
        pendingIndex = current.findIndex((message) => {
            return message.dedup_key === incoming.dedup_key;
        });
    }

    if (pendingIndex >= 0) {
        return current.map((message, index) => {
            if (index === pendingIndex) return incoming;
            return message;
        });
    }

    const alreadyExists = current.some((message) => message.id === incoming.id);
    if (alreadyExists) return current;
    return [...current, incoming];
}

function markSendingMessagesAsFailed(messages: MessageType[]) {
    return messages.map((message) => {
        if (message.client_status !== "sending") return message;
        return { ...message, client_status: "failed" as const };
    });
}

function mergeOlderMessages(current: MessageType[], older: MessageType[]) {
    const newMessages = current.filter((message) => {
        return !older.some((olderMessage) => olderMessage.id === message.id);
    });
    return [...older, ...newMessages];
}

export function ChatPage() {
    const navigate = useNavigate();
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [chats, setChats] = useState<ChatType[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [activeSearch, setActiveSearch] = useState("");
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
    const [manageMembersOpen, setManageMembersOpen] = useState(false);
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
        if (!selectedChat || !token) return;
        const chatId = selectedChat.id;
        const authToken = token;
        let active = true;

        async function loadHistory() {
            try {
                const page = await getMessages(chatId);
                if (!active) return;
                setMessages(page.items);
                setNextCursor(page.next_cursor);
                setHasMore(page.has_more);
            } catch (historyError) {
                if (historyError instanceof Error) setError(historyError.message);
            }
        }

        function connect() {
            if (!active) return;
            setConnectionStatus("connecting");
            const socket = new WebSocket(getWebSocketUrl(chatId, authToken));
            socketRef.current = socket;
            socket.onopen = () => {
                setConnectionStatus("connected");
                setError("");
            };
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "message.ack" || data.type === "message.created") {
                    const incoming = data.message as MessageType;
                    if (data.type === "message.ack") incoming.client_status = "sent";
                    setMessages((current) => addIncomingMessage(current, incoming));
                }
                if (data.type === "error") setError(data.detail);
            };
            socket.onerror = () => setConnectionStatus("disconnected");
            socket.onclose = () => {
                if (!active) return;
                setConnectionStatus("disconnected");
                setMessages(markSendingMessagesAsFailed);
                reconnectTimerRef.current = window.setTimeout(connect, 2000);
            };
        }
        loadHistory();
        connect();
        return () => {
            active = false;
            if (reconnectTimerRef.current !== null) window.clearTimeout(reconnectTimerRef.current);
            socketRef.current?.close();
            socketRef.current = null;
        };
    }, [selectedChat]);

    function sendMessage(text: string) {
        const socket = socketRef.current;
        if (!socket || socket.readyState !== WebSocket.OPEN || !selectedChat || !user) {
            setError("Chat connection is not ready");
            return false;
        }
        const dedupKey = crypto.randomUUID();
        const pendingMessage: MessageType = {
            id: dedupKey,
            chat_id: selectedChat.id,
            sender_id: user.id,
            dedup_key: dedupKey,
            message: text,
            created_at: new Date().toISOString(),
            client_status: "sending",
        };
        setMessages((current) => [...current, pendingMessage]);
        socket.send(JSON.stringify({ type: "message.send", dedup_key: dedupKey, message: text }));
        return true;
    }

    function selectChat(chat: ChatType) {
        setMessages([]);
        setError("");
        setActiveSearch("");
        setManageMembersOpen(false);
        setSelectedChat(chat);
    }

    function addCreatedChat(chat: ChatType) {
        setChats((current) => {
            const otherChats = current.filter((item) => item.id !== chat.id);
            return [chat, ...otherChats];
        });
        selectChat(chat);
    }

    async function searchMessages(search: string) {
        if (!selectedChat) return;
        setActiveSearch(search);
        try {
            const page = await getMessages(selectedChat.id, search);
            setMessages(page.items);
            setNextCursor(page.next_cursor);
            setHasMore(page.has_more);
        } catch (searchError) {
            if (searchError instanceof Error) setError(searchError.message);
        }
    }

    async function loadMore() {
        if (!selectedChat || !nextCursor || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const page = await getMessages(selectedChat.id, activeSearch, nextCursor);
            setMessages((current) => mergeOlderMessages(current, page.items));
            setNextCursor(page.next_cursor);
            setHasMore(page.has_more);
        } catch (loadError) {
            if (loadError instanceof Error) setError(loadError.message);
        } finally {
            setIsLoadingMore(false);
        }
    }

    async function handleDeleteChat() {
        if (!selectedChat) return;

        const confirmed = window.confirm("Delete this chat and all of its messages?");
        if (!confirmed) return;

        try {
            await deleteChat(selectedChat.id);
            const remainingChats = chats.filter((chat) => chat.id !== selectedChat.id);
            setChats(remainingChats);
            setMessages([]);
            setSelectedChat(remainingChats[0] || null);
            setError("");
        } catch (deleteError) {
            if (deleteError instanceof Error) setError(deleteError.message);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        socketRef.current?.close();
        navigate("/");
    }

    return (
        <main className="chat-page">
            <Sidebar chats={chats} selectedChatId={selectedChat?.id || null} onSelectChat={selectChat} onChatCreated={addCreatedChat} onLogout={logout} />
            <Chat chat={selectedChat} messages={messages} currentUserId={user?.id || ""} error={error} onSend={sendMessage} onSearch={searchMessages} hasMore={hasMore} isLoadingMore={isLoadingMore} onLoadMore={loadMore} connectionStatus={connectionStatus} onManageMembers={() => setManageMembersOpen(true)} onDeleteChat={handleDeleteChat} />
            {manageMembersOpen && selectedChat && user && <div className="modal-overlay" onMouseDown={() => setManageMembersOpen(false)}><div onMouseDown={(event) => event.stopPropagation()}><ManageMembers chatId={selectedChat.id} currentUserId={user.id} onClose={() => setManageMembersOpen(false)} /></div></div>}
        </main>
    );
}
