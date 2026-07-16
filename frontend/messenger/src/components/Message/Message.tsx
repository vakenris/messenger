import type { Message as MessageType } from "../../api";
import "./message.css";

type MessageProps = {
    message: MessageType;
    isOwn: boolean;
};

function getStatusSymbol(status: MessageType["client_status"]) {
    if (status === "sending") return "…";
    if (status === "sent") return "✓";
    if (status === "failed") return "!";
    return "";
}

export function Message({ message, isOwn }: MessageProps) {
    const time = new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    let rowClass = "message-row";
    let bubbleClass = "message-bubble";
    if (isOwn) {
        rowClass += " message-row-own";
        bubbleClass += " message-bubble-own";
    }

    const showStatus = isOwn && message.client_status;

    return (
        <div className={rowClass}>
            <div className={bubbleClass}>
                <p className="message-text">{message.message}</p>
                <span className="message-time">{time}</span>
                {showStatus && (
                    <span className={`message-status message-status-${message.client_status}`}>
                        {getStatusSymbol(message.client_status)}
                    </span>
                )}
            </div>
        </div>
    );
}
