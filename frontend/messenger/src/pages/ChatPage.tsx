import { Sidebar } from "../components/Sidebar/Sidebar"
import { Chat } from "../components/Chat/Chat"
import "./pages.css";
export function ChatPage(){
    return(
        <main className="chat-page">
            <Sidebar></Sidebar>
            <Chat></Chat>
        </main>
    )
}