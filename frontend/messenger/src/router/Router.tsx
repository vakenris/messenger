import { Route, Routes } from "react-router";
import { EnterPage } from "../pages/EnterPage"
import { RegistrationPage } from "../pages/RegistrationPage"
import { ChatPage } from "../pages/ChatPage";
export function AppRouter(){
    return(
        <Routes>
            <Route path="/" element={<EnterPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/chats" element={<ChatPage />} />
            <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
    );
}
