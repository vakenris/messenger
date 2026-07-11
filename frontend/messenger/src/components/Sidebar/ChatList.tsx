import "./Sidebar.css";
import type { ReactNode } from "react";

type ChatListProps = {
    children: ReactNode;
}

export function ChatList({children}: ChatListProps) {
    return(
        <div className="chat-list">
            {children}
        </div>
    );
}