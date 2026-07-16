import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { createChat, getUsers, type Chat, type User as UserType } from "../../../api";
import { User } from "../User";
import "./newchat.css";

type NewChatProps = {
    onClose: () => void;
    onCreated: (chat: Chat) => void;
};

export function NewChat({ onClose, onCreated }: NewChatProps) {
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        getUsers().then(setUsers).catch((requestError: Error) => setError(requestError.message));
    }, []);

    async function submit() {
        if (!selectedId) {
            setError("Выберите пользователя");
            return;
        }
        const selectedUser = users.find((user) => user.id === selectedId);
        setIsCreating(true);
        setError("");
        try {
            const chat = await createChat("direct", [selectedId], selectedUser?.user_nick || null);
            onCreated(chat);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Не удалось создать чат");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="new-chat">
            <div className="header-nchat">
                <h2>New chat</h2>
                <button onClick={onClose} aria-label="Close"><FaXmark size={24} /></button>
            </div>
            <div className="users-list">
                {users.map((user) => (
                    <User key={user.id} user={user} checked={selectedId === user.id} onChange={() => setSelectedId(user.id)} />
                ))}
            </div>
            {error && <p className="modal-error">{error}</p>}
            <div className="buttons">
                <button className="cancel" onClick={onClose}>Cancel</button>
                <button className="create" onClick={submit} disabled={isCreating}>{isCreating ? "Creating..." : "Create"}</button>
            </div>
        </div>
    );
}
