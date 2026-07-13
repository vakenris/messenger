import "./message.css"

export function Message(){
    return(
        <div className="message">
            <p className="message-text">Привет! Как дела?</p>
            <p className="message-time">10:42</p>
        </div>
    );
}