import "./Authorize.css"
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../../api";

export function EnterPart(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const data = await login(userName, password);
            localStorage.setItem("token", data.access_token);
            navigate("/chats");
        } catch (requestError) {
            if (requestError instanceof Error) {
                setError(requestError.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <form className="enter" onSubmit={handleSubmit}>
            <div className="header-enter">
                <h1>Sign in</h1>
                <p>Log in to your account</p>
            </div>
            <div className="form">
                <input value={userName} onChange={(event) => setUserName(event.target.value)} type="text" placeholder="Логин" required/>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Пароль" required/>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="button-registration" disabled={isLoading}>{isLoading ? "Входим..." : "Sign in"}</button>
            <p className="already-account">No account? <Link to="/registration">Sign up</Link></p>
        </form>
    );
}
