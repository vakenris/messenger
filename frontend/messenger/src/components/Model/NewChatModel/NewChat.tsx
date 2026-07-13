import { FaXmark } from "react-icons/fa6";
import { User } from "../User";
import "./newchat.css";
export function NewChat(){
    return(
        <div className="new-chat">
            <div className="header-nchat">
                <h2>New chat</h2>
                <button>
                    <FaXmark size={24}></FaXmark>
                </button>
            </div>
            <User/>
            <div className="buttons">
                <button className="cancel">Cancel</button>
                <button className="create">Create</button>
            </div>
        </div>
    );
}
