import { useState } from "react";
import { HeaderChat } from "./HeaderChat";
import { MessageInput } from "./MessageInput";
import { SquareMore } from "./SquareMore";
import { SearchInput } from "../Sidebar/SearchInput";

export function Chat(){
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [onSearch, setOnSearch] = useState(false);
    let menu;
    if (isMenuOpen){
        menu = <SquareMore/>
    }
    else{
        menu = null
    }
    let search;
    if (onSearch){
        search = <SearchInput/>
    }
    else{
        search = null
    }
    return(
        <div className="chat-part">
            <HeaderChat search={search} ClickOnSearch={() => setOnSearch(!onSearch)} ClickOnMenu={() => setMenuOpen(!isMenuOpen)}/>
            <div className="messages-area">
                {menu}
            </div>
            <MessageInput/>
        </div>
    );
}