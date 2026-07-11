import { FiArrowRight, FiSearch } from "react-icons/fi";
import "./Chat.css";
export function MessageInput() {
    return(
        <div className="message-input">
            <div className="icon-input-part">
                <FiSearch/>
                <textarea rows={1} placeholder="Write a message..."/>
            </div>
            <button className="button-send">
                <FiArrowRight></FiArrowRight>
            </button>
        </div>
    );
}