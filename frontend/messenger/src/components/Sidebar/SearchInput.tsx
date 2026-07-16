import { FiSearch } from "react-icons/fi";
import "./Sidebar.css";

type SearchInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="search-input">
            <FiSearch />
            <input
                type="text"
                placeholder="Search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}
