export function ChatItem() {
    return(
        <div className="chat-item">
            <div className="avatar">
                <text className="avatar-name">A</text>
            </div>
            <div className="text-part">
                <div className="header-part">
                    <text className="user-name">Anna Petrova</text>
                    <text className="time">10:42</text>
                </div>
                <div className="message">
                    <text>Can you send the files?</text>
                </div>
            </div>
        </div>
    );
}