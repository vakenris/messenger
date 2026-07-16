import type { Message as MessageType } from "../../api";
import "./message.css";

type MessageProps = {
    message: MessageType;
    isOwn: boolean;
};

export function Message({ message, isOwn }: MessageProps) {
    const time = new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={`message-row ${isOwn ? "message-row-own" : ""}`}>
            <div className={`message-bubble ${isOwn ? "message-bubble-own" : ""}`}>
                <p className="message-text">{message.message}</p>
                <span className="message-time">{time}</span>
            </div>
        </div>
    );
}
