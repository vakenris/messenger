import "./Authorize.css"
import {Link} from "react-router"
export function RegistrationPart(){
    return(
        <div className="registration">
            <div className="header-registration">
                <h1>Sign up</h1>
                <p>Create account</p>
            </div>
            <div className="form">
                <input type="text" placeholder="Your name"/>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <input type="password" placeholder="Repeat the password"/>
            </div>
            <button className="button-registration">Sign up</button>
            <p className="already-account">Do you already have an account? <Link to="/">Sign in</Link></p>
        </div>
    );
}