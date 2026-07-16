import { useState } from "react";
import type { Chat } from "../../api";
import { SquareAdd } from "../Chat/SquareAdd";
import { NewChat } from "../Model/NewChatModel/NewChat";
import { NewGroup } from "../Model/NewGroupModel/NewGroup";
import { ChatItem } from "./ChatItem";
import { ChatList } from "./ChatList";
import { HeaderSidebar } from "./HeaderSidebar";
import { SearchInput } from "./SearchInput";

type SidebarProps = {
    chats: Chat[];
    selectedChatId: string | null;
    onSelectChat: (chat: Chat) => void;
    onChatCreated: (chat: Chat) => void;
    onLogout: () => void;
};

function getChatTitle(chat: Chat) {
    if (chat.title) return chat.title;
    if (chat.type === "direct") return "Personal chat";
    return "Group chat";
}

export function Sidebar(props: SidebarProps) {
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [modal, setModal] = useState<"chat" | "group" | null>(null);

    const query = search.trim().toLowerCase();
    let visibleChats = props.chats;
    if (query) {
        visibleChats = props.chats.filter((chat) => {
            return getChatTitle(chat).toLowerCase().includes(query);
        });
    }

    function toggleAddMenu() {
        setIsAddOpen(!isAddOpen);
    }

    function openModal(type: "chat" | "group") {
        setIsAddOpen(false);
        setModal(type);
    }

    function closeModal() {
        setModal(null);
    }

    function handleCreated(chat: Chat) {
        closeModal();
        props.onChatCreated(chat);
    }

    let modalContent = null;
    if (modal === "chat") {
        modalContent = <NewChat onClose={closeModal} onCreated={handleCreated} />;
    }
    if (modal === "group") {
        modalContent = <NewGroup onClose={closeModal} onCreated={handleCreated} />;
    }

    return (
        <div className="sidebar">
            <HeaderSidebar ClickOnAdd={toggleAddMenu} />

            {isAddOpen && (
                <SquareAdd
                    onNewGroup={() => openModal("group")}
                    onNewChat={() => openModal("chat")}
                />
            )}

            <SearchInput value={search} onChange={setSearch} />

            <ChatList>
                {visibleChats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        isSelected={chat.id === props.selectedChatId}
                        onClick={() => props.onSelectChat(chat)}
                    />
                ))}
                {visibleChats.length === 0 && <p className="empty-text">Chats not found</p>}
            </ChatList>

            <div className="sidebar-footer">
                <button className="logout-button" onClick={props.onLogout}>Log out</button>
            </div>

            {modalContent && (
                <div className="modal-overlay" onMouseDown={closeModal}>
                    <div onMouseDown={(event) => event.stopPropagation()}>
                        {modalContent}
                    </div>
                </div>
            )}
        </div>
    );
}
