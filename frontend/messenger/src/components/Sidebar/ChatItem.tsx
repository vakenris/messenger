import type { Chat } from "../../api";

type ChatItemProps = {
    chat: Chat;
    isSelected: boolean;
    onClick: () => void;
};

export function ChatItem({ chat, isSelected, onClick }: ChatItemProps) {
    const title = chat.title || (chat.type === "direct" ? "Личный чат" : "Групповой чат");

    return (
        <button className={`chat-item ${isSelected ? "chat-item-selected" : ""}`} onClick={onClick}>
            <div className="avatar">
                <span className="avatar-name">{title.charAt(0).toUpperCase()}</span>
            </div>
            <div className="text-part">
                <div className="header-part">
                    <span className="user-name">{title}</span>
                </div>
                <div className="chat-type">{chat.type === "direct" ? "Личный" : "Группа"}</div>
            </div>
        </button>
    );
}
