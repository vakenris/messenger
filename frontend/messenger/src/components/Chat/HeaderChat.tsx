import { useState } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";
import { SquareMore } from "./SquareMore";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

type HeaderChatProps = {
    title: string;
    search: string;
    onSearch: (value: string) => void;
    connectionStatus: ConnectionStatus;
    onManageMembers?: () => void;
    onDeleteChat: () => void;
};

function getStatusText(status: ConnectionStatus) {
    if (status === "connected") return "Chat connected";
    if (status === "connecting") return "Connecting...";
    return "Disconnected";
}

export function HeaderChat(props: HeaderChatProps) {
    const [moreOpen, setMoreOpen] = useState(false);

    function toggleMenu() {
        setMoreOpen(!moreOpen);
    }

    function openMembers() {
        setMoreOpen(false);
        if (props.onManageMembers) props.onManageMembers();
    }

    function deleteChat() {
        setMoreOpen(false);
        props.onDeleteChat();
    }

    const showMenu = moreOpen;

    return (
        <div className="header-chat">
            <div className="user">
                <div className="avatar">
                    <span className="avatar-name">{props.title.charAt(0).toUpperCase()}</span>
                </div>
                <div className="user-descr">
                    <span className="user-name">{props.title}</span>
                    <span className={`status status-${props.connectionStatus}`}>
                        {getStatusText(props.connectionStatus)}
                    </span>
                </div>
            </div>

            <div className="icons-header">
                <div className="search-input header-search-input">
                    <FiSearch />
                    <input
                        value={props.search}
                        onChange={(event) => props.onSearch(event.target.value)}
                        type="text"
                        placeholder="Search messages"
                    />
                </div>

                <button className="button-more" onClick={toggleMenu} aria-label="Chat menu">
                    <FiMoreVertical size={22} />
                </button>

                {showMenu && (
                    <SquareMore
                        onManageMembers={props.onManageMembers ? openMembers : undefined}
                        onDeleteChat={deleteChat}
                    />
                )}
            </div>
        </div>
    );
}
