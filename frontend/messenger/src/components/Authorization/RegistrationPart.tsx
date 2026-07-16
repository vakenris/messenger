import "./Authorize.css"
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login, register } from "../../api";

export function RegistrationPart(){
    const navigate = useNavigate();
    const [userNick, setUserNick] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError("");

        if (password !== repeatPassword) {
            setError("Пароли не совпадают");
            return;
        }

        setIsLoading(true);
        try {
            await register(userName, userNick, password);
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
        <form className="registration" onSubmit={handleSubmit}>
            <div className="header-registration">
                <h1>Sign up</h1>
                <p>Create account</p>
            </div>
            <div className="form">
                <input value={userNick} onChange={(event) => setUserNick(event.target.value)} type="text" placeholder="Ваше имя" required/>
                <input value={userName} onChange={(event) => setUserName(event.target.value)} type="text" placeholder="Логин" required/>
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Пароль" required/>
                <input value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} type="password" placeholder="Повторите пароль" required/>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="button-registration" disabled={isLoading}>{isLoading ? "Создаём..." : "Sign up"}</button>
            <p className="already-account">Do you already have an account? <Link to="/">Sign in</Link></p>
        </form>
    );
}
