import type { ReactNode } from "react";
import { FiMoreHorizontal, FiSearch } from "react-icons/fi";

type HeaderChatProps = {
        ClickOnMenu: () => void,
        ClickOnSearch: () => void,
        search: ReactNode
    }
export function HeaderChat({ClickOnMenu, ClickOnSearch, search}:HeaderChatProps){
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
            <div className="icons-header">
                <div className="header-search">
                        {search}
                </div>
                <button className="button-search" onClick={ClickOnSearch}>
                    <FiSearch size={27}/>
                </button>
                <button className="button-more" onClick={ClickOnMenu}>
                    <FiMoreHorizontal size={27}></FiMoreHorizontal>
                </button>
            </div>
        </div>
    );
}