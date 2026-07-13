import { Route, Routes } from "react-router";
import { EnterPage } from "../pages/EnterPage"
import { RegistrationPage } from "../pages/RegistrationPage"
import { NewChat } from "../components/Model/NewChatModel/NewChat";
import { NewGroup } from "../components/Model/NewGroupModel/NewGroup";
export function AppRouter(){
    return(
        <Routes>
            <Route path="/" element={<EnterPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="*" element={<h1>Page not found</h1>} />
            <Route path="/test" element={<NewChat/>}/>
            <Route path="/test2" element={<NewGroup/>}></Route>
        </Routes>
    );
}