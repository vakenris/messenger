import {FiTrash} from "react-icons/fi";
export function SquareMore() {
    return(
        <div className="more">
            <div className="delete">
                <button className="button-delete">
                    <FiTrash/>
                    <p>Delete chat</p>
                </button>
            </div>
        </div>
    );
}