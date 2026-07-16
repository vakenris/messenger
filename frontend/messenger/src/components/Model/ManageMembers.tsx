import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import {
    addChatMember,
    getChatMembers,
    getUsers,
    removeChatMember,
    updateChatMemberRole,
    type ChatMember,
    type User,
} from "../../api";
import "./NewChatModel/newchat.css";

type ManageMembersProps = {
    chatId: string;
    currentUserId: string;
    onClose: () => void;
};

export function ManageMembers(props: ManageMembersProps) {
    const [members, setMembers] = useState<ChatMember[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function loadData() {
        const memberList = await getChatMembers(props.chatId);
        const userList = await getUsers();
        return { memberList, userList };
    }

    async function reload() {
        const data = await loadData();
        setMembers(data.memberList);
        setUsers(data.userList);
    }

    useEffect(() => {
        let active = true;

        async function initialLoad() {
            try {
                const memberList = await getChatMembers(props.chatId);
                const userList = await getUsers();
                if (!active) return;
                setMembers(memberList);
                setUsers(userList);
            } catch (loadError) {
                if (!active) return;
                if (loadError instanceof Error) setError(loadError.message);
            }
        }

        initialLoad();
        return () => {
            active = false;
        };
    }, [props.chatId]);

    const actor = members.find((member) => member.user_id === props.currentUserId);
    const isOwner = actor?.role === "owner";
    const canManage = isOwner || actor?.role === "admin";

    const availableUsers = users.filter((user) => {
        const alreadyMember = members.some((member) => member.user_id === user.id);
        return !alreadyMember;
    });

    async function runAction(action: () => Promise<unknown>) {
        setBusy(true);
        setError("");
        try {
            await action();
            await reload();
        } catch (actionError) {
            if (actionError instanceof Error) setError(actionError.message);
            else setError("Action failed");
        } finally {
            setBusy(false);
        }
    }

    async function changeRole(member: ChatMember) {
        let newRole: "member" | "admin" = "admin";
        if (member.role === "admin") newRole = "member";
        await runAction(() => updateChatMemberRole(props.chatId, member.user_id, newRole));
    }

    async function removeMember(member: ChatMember) {
        await runAction(() => removeChatMember(props.chatId, member.user_id));
    }

    async function addMember() {
        if (!selectedUserId) return;
        await runAction(() => addChatMember(props.chatId, selectedUserId));
        setSelectedUserId("");
    }

    return (
        <div className="new-chat members-modal">
            <div className="header-nchat">
                <h2>Group members</h2>
                <button onClick={props.onClose} aria-label="Close">
                    <FaXmark size={24} />
                </button>
            </div>

            <div className="users-list">
                {members.map((member) => {
                    const canChangeRole = isOwner && member.role !== "owner";
                    const canRemove = canManage
                        && member.role !== "owner"
                        && member.user_id !== props.currentUserId;
                    let roleButtonText = "Make admin";
                    if (member.role === "admin") roleButtonText = "Make member";

                    return (
                        <div className="member-row" key={member.user_id}>
                            <div>
                                <strong>{member.user_nick}</strong>
                                <span>@{member.user_name} · {member.role}</span>
                            </div>
                            <div className="member-actions">
                                {canChangeRole && (
                                    <button disabled={busy} onClick={() => changeRole(member)}>
                                        {roleButtonText}
                                    </button>
                                )}
                                {canRemove && (
                                    <button className="danger-button" disabled={busy} onClick={() => removeMember(member)}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {canManage && availableUsers.length > 0 && (
                <div className="add-member-row">
                    <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
                        <option value="">Select user</option>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.user_nick} (@{user.user_name})
                            </option>
                        ))}
                    </select>
                    <button className="create" disabled={!selectedUserId || busy} onClick={addMember}>
                        Add
                    </button>
                </div>
            )}

            {!canManage && <p className="empty-text">Only owners and admins can manage members.</p>}
            {error && <p className="modal-error">{error}</p>}
        </div>
    );
}
