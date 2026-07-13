import { useState } from "react";
import { ChatItem } from "./ChatItem";
import { ChatList } from "./ChatList";
import { HeaderSidebar } from "./HeaderSidebar";
import { SquareAdd } from "../Chat/SquareAdd";

export function Sidebar(){
    const [isAddOpen, setAddOpen] = useState(false);
    let open;
    if (isAddOpen){
        open = <SquareAdd></SquareAdd>
    }
    else{
        open = null
    }
    return(
        <div className="sidebar">
            <HeaderSidebar ClickOnAdd={() => setAddOpen(!isAddOpen)}></HeaderSidebar>
            {open}
            <ChatList>
                <ChatItem/>
                <ChatItem/>
                <ChatItem/>
                <ChatItem/>
                <ChatItem/>
                <ChatItem/>
                <ChatItem/>
            </ChatList>
        </div>
    );
        
}
