type SquareAddProps = {
    onNewGroup: () => void;
    onNewChat: () => void;
};

export function SquareAdd({ onNewGroup, onNewChat }: SquareAddProps) {
    return (
        <div className="add">
            <button className="part-add" onClick={onNewGroup}>
                <p>New group</p>
            </button>
            <button className="part-add" onClick={onNewChat}>
                <p>New chat</p>
            </button>
        </div>
    );
}
