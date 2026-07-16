import type { Chat } from "../../api";
import { ChatItem } from "./ChatItem";
import { ChatList } from "./ChatList";

type SidebarProps = {
    chats: Chat[];
    selectedChatId: string | null;
    userName: string;
    onSelectChat: (chat: Chat) => void;
    onLogout: () => void;
};

export function Sidebar({ chats, selectedChatId, userName, onSelectChat, onLogout }: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="header">
                <div>
                    <h1>Messages</h1>
                    <p className="sidebar-user">{userName}</p>
                </div>
                <button className="logout-button" onClick={onLogout}>Выйти</button>
            </div>
            <ChatList>
                {chats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        isSelected={chat.id === selectedChatId}
                        onClick={() => onSelectChat(chat)}
                    />
                ))}
                {chats.length === 0 && <p className="empty-text">У вас пока нет чатов</p>}
            </ChatList>
        </div>
    );
}
