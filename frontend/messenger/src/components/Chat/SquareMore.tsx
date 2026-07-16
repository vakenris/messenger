import { FiTrash, FiUsers } from "react-icons/fi";

type SquareMoreProps = {
    onManageMembers?: () => void;
    onDeleteChat: () => void;
};

export function SquareMore(props: SquareMoreProps) {
    return (
        <div className="more">
            {props.onManageMembers && (
                <button className="button-delete" onClick={props.onManageMembers}>
                    <FiUsers />
                    <p>Manage members</p>
                </button>
            )}
            <button className="button-delete danger-button" onClick={props.onDeleteChat}>
                <FiTrash />
                <p>Delete chat</p>
            </button>
        </div>
    );
}
