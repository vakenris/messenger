import "./Sidebar.css";
import {FiSearch} from "react-icons/fi";
export function SearchInput() {
    return(
        <div className="search-input">
            <FiSearch/>
            <input type="text" placeholder="Search"></input>
        </div>
    );
}