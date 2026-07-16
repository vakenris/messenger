import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { createChat, getUsers, type Chat, type User as UserType } from "../../../api";
import { User } from "../User";
import "../NewChatModel/newchat.css";

type NewGroupProps = {
    onClose: () => void;
    onCreated: (chat: Chat) => void;
};

export function NewGroup({ onClose, onCreated }: NewGroupProps) {
    const [users, setUsers] = useState<UserType[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        getUsers().then(setUsers).catch((requestError: Error) => setError(requestError.message));
    }, []);

    function toggleUser(userId: string) {
        setSelectedIds((current) => current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]);
    }

    async function submit() {
        if (!title.trim()) return setError("Введите название группы");
        if (selectedIds.length === 0) return setError("Выберите хотя бы одного пользователя");
        setIsCreating(true);
        setError("");
        try {
            const chat = await createChat("group", selectedIds, title.trim());
            onCreated(chat);
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Не удалось создать группу");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="new-chat">
            <div className="header-nchat">
                <h2>New Group</h2>
                <button onClick={onClose} aria-label="Close"><FaXmark size={24} /></button>
            </div>
            <input className="group-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Group name" />
            <div className="users-list">
                {users.map((user) => (
                    <User key={user.id} user={user} selectionType="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleUser(user.id)} />
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
