import { FiSearch } from "react-icons/fi";

type HeaderChatProps = {
    title: string;
    search: string;
    onSearch: (value: string) => void;
};

export function HeaderChat({ title, search, onSearch }: HeaderChatProps) {
    return (
        <div className="header-chat">
            <div className="user">
                <div className="avatar">
                    <span className="avatar-name">{title.charAt(0).toUpperCase()}</span>
                </div>
                <div className="user-descr">
                    <span className="user-name">{title}</span>
                    <span className="status">чат подключён</span>
                </div>
            </div>
            <div className="search-input header-search-input">
                <FiSearch />
                <input
                    value={search}
                    onChange={(event) => onSearch(event.target.value)}
                    type="text"
                    placeholder="Поиск сообщений"
                />
            </div>
        </div>
    );
}
