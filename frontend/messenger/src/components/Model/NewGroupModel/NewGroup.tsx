import { FaXmark } from "react-icons/fa6";
import { User } from "../User";
import "../NewChatModel/newchat.css";

export function NewGroup(){
    return(
        <div className="new-chat">
            <div className="header-nchat">
                <h2>New Group</h2>
                <button>
                    <FaXmark size={24} />
                </button>
            </div>
            <User selectionType="checkbox" />
            <div className="buttons">
                <button className="cancel">Cancel</button>
                <button className="create">Create</button>
            </div>
        </div>
    );
}
