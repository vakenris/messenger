import "./NewChatModel/newchat.css";

type UserProps = {
    selectionType?: "radio" | "checkbox";
};

export function User({ selectionType = "radio" }: UserProps){
    return(
        <div className="user">
            <div className="user-info">
                <div className="user-avatar">
                    <p>A</p>
                </div>
                <p className="user-name">Anna Petrova</p>
            </div>
            <input type={selectionType} className="choose" />
        </div>
    );
}
