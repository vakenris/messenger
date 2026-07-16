const API_URL = import.meta.env.VITE_API_URL || "/api";

export type User = {
    id: string;
    user_name: string;
    user_nick: string;
};

export type Chat = {
    id: string;
    title: string | null;
    type: "direct" | "group";
    created_by: string;
    created_at: string;
};

export type Message = {
    id: string;
    chat_id: string;
    sender_id: string;
    dedup_key: string | null;
    message: string;
    created_at: string;
    client_status?: "sending" | "sent" | "failed";
};

export type MessagePage = {
    items: Message[];
    next_cursor: string | null;
    has_more: boolean;
};

export type ChatMember = {
    user_id: string;
    user_name: string;
    user_nick: string;
    role: "member" | "admin" | "owner";
    joined_at: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.detail || "Не удалось выполнить запрос";
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

export async function login(userName: string, password: string) {
    return request<{ access_token: string }>("/login", {
        method: "POST",
        body: JSON.stringify({ user_name: userName, password }),
    });
}

export async function register(userName: string, userNick: string, password: string) {
    return request<User>("/register", {
        method: "POST",
        body: JSON.stringify({
            user_name: userName,
            user_nick: userNick,
            password,
        }),
    });
}

export function getMe() {
    return request<User>("/me");
}

export function getChats() {
    return request<Chat[]>("/chats");
}

export function getUsers() {
    return request<User[]>("/users");
}

export function createChat(type: "direct" | "group", invitedUserIds: string[], title: string | null = null) {
    return request<Chat>("/chats", {
        method: "POST",
        body: JSON.stringify({
            type,
            title,
            invited_user_ids: invitedUserIds,
        }),
    });
}

export function deleteChat(chatId: string) {
    return request<{ message: string }>(`/chats/${chatId}`, {
        method: "DELETE",
    });
}

export function getMessages(chatId: string, search = "", cursor: string | null = null) {
    const cursorQuery = cursor ? `&cursor=${encodeURIComponent(cursor)}` : "";
    if (search.trim()) {
        const query = encodeURIComponent(search.trim());
        return request<MessagePage>(`/chats/${chatId}/messages/search?q=${query}${cursorQuery}`);
    }

    return request<MessagePage>(`/chats/${chatId}/messages${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`);
}

export function getChatMembers(chatId: string) {
    return request<ChatMember[]>(`/chats/${chatId}/members`);
}

export function addChatMember(chatId: string, userId: string) {
    return request<{ message: string }>(`/chats/${chatId}/members?user_id=${encodeURIComponent(userId)}`, { method: "POST" });
}

export function removeChatMember(chatId: string, userId: string) {
    return request<{ message: string }>(`/chats/${chatId}/members/${userId}`, { method: "DELETE" });
}

export function updateChatMemberRole(chatId: string, userId: string, role: "member" | "admin") {
    return request<ChatMember>(`/chats/${chatId}/members/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
}

export function getWebSocketUrl(chatId: string, token: string) {
    const configuredUrl = import.meta.env.VITE_WS_URL || "/ws";

    if (configuredUrl.startsWith("ws://") || configuredUrl.startsWith("wss://")) {
        return `${configuredUrl}/chats/${chatId}?token=${encodeURIComponent(token)}`;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}${configuredUrl}/chats/${chatId}?token=${encodeURIComponent(token)}`;
}
