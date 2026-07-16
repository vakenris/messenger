import type { User as UserType } from "../../api";
import "./NewChatModel/newchat.css";

type UserProps = {
    user: UserType;
    selectionType?: "radio" | "checkbox";
    checked: boolean;
    onChange: () => void;
};

export function User({ user, selectionType = "radio", checked, onChange }: UserProps) {
    return (
        <label className="modal-user">
            <div className="user-info">
                <div className="user-avatar">
                    <p>{user.user_nick.charAt(0).toUpperCase()}</p>
                </div>
                <div>
                    <p className="user-name">{user.user_nick}</p>
                    <span className="user-login">@{user.user_name}</span>
                </div>
            </div>
            <input
                type={selectionType}
                name={selectionType === "radio" ? "chat-user" : undefined}
                className="choose"
                checked={checked}
                onChange={onChange}
            />
        </label>
    );
}
