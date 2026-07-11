import { FiPlus } from "react-icons/fi"

export function HeaderSidebar(){
    return(
        <div className="header">
            <h1>Messages</h1>
            <button className="button-add">
                <FiPlus/>
            </button>
        </div>
    );
}