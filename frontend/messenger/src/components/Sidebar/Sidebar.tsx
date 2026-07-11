import { ChatItem } from "./ChatItem";
import { ChatList } from "./ChatList";
import { HeaderSidebar } from "./HeaderSidebar";
import { SearchInput } from "./SearchInput";

export function Sidebar(){
    return(
        <div className="sidebar">
            <HeaderSidebar></HeaderSidebar>
            <SearchInput></SearchInput>
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