import { FiMoreHorizontal } from "react-icons/fi";
export function HeaderChat(){
    return(
        <div className="header-chat">
            <div className="user">
                <div className="avatar">
                    <text className="avatar-name">A</text>
                </div>
                <div className="user-descr">
                    <text className="user-name">Anna Petrova</text>
                    <text className="status">online</text>
                </div>
            </div>
            <button className="button-more">
                <FiMoreHorizontal size={27}></FiMoreHorizontal>
            </button>
        </div>
    );
}