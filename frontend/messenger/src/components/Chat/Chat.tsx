import { useState } from "react";
import type { Chat as ChatType, Message as MessageType } from "../../api";
import { Message } from "../Message/Message";
import { HeaderChat } from "./HeaderChat";
import { MessageInput } from "./MessageInput";

type ChatProps = {
    chat: ChatType | null;
    messages: MessageType[];
    currentUserId: string;
    error: string;
    onSend: (text: string) => boolean;
    onSearch: (search: string) => void;
};

export function Chat({ chat, messages, currentUserId, error, onSend, onSearch }: ChatProps) {
    const [search, setSearch] = useState("");

    if (!chat) {
        return <div className="empty-chat">Выберите чат или создайте новый</div>;
    }

    const title = chat.title || (chat.type === "direct" ? "Личный чат" : "Групповой чат");

    function handleSearch(value: string) {
        setSearch(value);
        onSearch(value);
    }

    return (
        <div className="chat-part">
            <HeaderChat title={title} search={search} onSearch={handleSearch} />
            {error && <p className="chat-error">{error}</p>}
            <div className="messages-area">
                {messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                        isOwn={message.sender_id === currentUserId}
                    />
                ))}
                {messages.length === 0 && <p className="empty-text">Сообщений пока нет</p>}
            </div>
            <MessageInput onSend={onSend} />
        </div>
    );
}
