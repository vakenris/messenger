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
    hasMore: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    connectionStatus: "connecting" | "connected" | "disconnected";
    onManageMembers: () => void;
    onDeleteChat: () => void;
};

function getChatTitle(chat: ChatType) {
    if (chat.title) return chat.title;
    if (chat.type === "direct") return "Personal chat";
    return "Group chat";
}

export function Chat(props: ChatProps) {
    const [search, setSearch] = useState("");

    if (!props.chat) {
        return <div className="empty-chat">Select a chat or create a new one</div>;
    }

    function handleSearch(value: string) {
        setSearch(value);
        props.onSearch(value);
    }

    let loadButtonText = "Load older messages";
    if (props.isLoadingMore) loadButtonText = "Loading...";

    let manageMembers: (() => void) | undefined;
    if (props.chat.type === "group") manageMembers = props.onManageMembers;

    return (
        <div className="chat-part">
            <HeaderChat
                title={getChatTitle(props.chat)}
                search={search}
                onSearch={handleSearch}
                connectionStatus={props.connectionStatus}
                onManageMembers={manageMembers}
                onDeleteChat={props.onDeleteChat}
            />

            {props.error && <p className="chat-error">{props.error}</p>}

            <div className="messages-area">
                {props.hasMore && (
                    <button
                        className="load-more-button"
                        onClick={props.onLoadMore}
                        disabled={props.isLoadingMore}
                    >
                        {loadButtonText}
                    </button>
                )}

                {props.messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                        isOwn={message.sender_id === props.currentUserId}
                    />
                ))}

                {props.messages.length === 0 && <p className="empty-text">No messages yet</p>}
            </div>

            <MessageInput onSend={props.onSend} />
        </div>
    );
}
