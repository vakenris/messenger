import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import "./Chat.css";

type MessageInputProps = {
    onSend: (text: string) => boolean;
};

export function MessageInput({ onSend }: MessageInputProps) {
    const [text, setText] = useState("");

    function send() {
        const message = text.trim();
        if (!message) {
            return;
        }

        const wasSent = onSend(message);
        if (wasSent) {
            setText("");
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
        }
    }

    return (
        <div className="message-input">
            <div className="icon-input-part">
                <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Write a message..."
                />
            </div>
            <button className="button-send" onClick={send} aria-label="Отправить">
                <FiArrowRight />
            </button>
        </div>
    );
}
