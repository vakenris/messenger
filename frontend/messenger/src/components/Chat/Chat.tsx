import { HeaderChat } from "./HeaderChat";
import { MessageInput } from "./MessageInput";

export function Chat(){
    return(
        <div className="chat-part">
            <HeaderChat/>
            <div className="messages-area"></div>
            <MessageInput/>
        </div>
    );
}