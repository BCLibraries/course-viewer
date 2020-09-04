import * as React from 'react';
import {useState} from 'react';
import './LoginPage.css';
// Fetch polyfill
import "promise/polyfill"
import "whatwg-fetch"
import useFetchLogin from "./Hooks/UseFetchLogin";
import SetUserCallbackInterface from "./Interfaces/SetUserCallbackInterface";

type LoginPageProps = {
    setUser: SetUserCallbackInterface
}

/**
 * Display the login page
 *
 * @param setUser a callback to set the user object
 * @constructor
 */
function LoginPage({setUser}: LoginPageProps) {

    // Login form input state.
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    // For communicating with the login server.
    const [{isError}, setLoginPayload] = useFetchLogin(setUser);

    return (
        <div className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-container">
                <p><strong>Login</strong> to view courses in your schedule.</p>
                <form>
                    <div className="form-input-group">
                        <label htmlFor="login-uid">Username</label>
                        <input type="text"
                               name="username"
                               id="login-uid"
                               value={username}
                               onChange={(event) => setUserName(event.target.value)}
                        />
                    </div>
                    <div className="form-input-group">
                        <label htmlFor="login-password">Password</label>
                        <input type="password"
                               name="password"
                               id="login-password"
                               value={password}
                               onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <input type="submit" value="Login"/>
                    {isError && <div className="login-error">There was a problem with your username or password</div>}
                </form>
            </div>
        </div>
    );

    /**
     * Send a login request to the API
     *
     * @param event
     */
    function handleSubmit(event: React.FormEvent<HTMLDivElement>) {

        setLoginPayload({password, username});

        // Reset username and password inputs after submitting.
        setUserName('');
        setPassword('');

        // Don't let the page reload.
        event.preventDefault();
    }
}


export default LoginPage;