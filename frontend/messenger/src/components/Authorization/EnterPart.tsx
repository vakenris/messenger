import "./Authorize.css"
import {Link} from "react-router"
export function EnterPart(){
    return(
        <div className="enter">
            <div className="header-enter">
                <h1>Sign in</h1>
                <p>Log in to your account</p>
            </div>
            <div className="form">
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
            </div>
            <button className="button-registration">Sign in</button>
            <p className="already-account">No account? <Link to="/registration">Sign up</Link></p>
        </div>
    );
}