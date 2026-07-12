import { FiPlus } from "react-icons/fi"

type HeaderSideBarProps = {
    ClickOnAdd: () => void;
}

export function HeaderSidebar({ClickOnAdd}: HeaderSideBarProps){
    return(
        <div className="header">
            <h1>Messages</h1>
            <button className="button-add" onClick={ClickOnAdd}>
                <FiPlus/>
            </button>
        </div>
    );
}