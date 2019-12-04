import * as React from 'react';
import {useState} from 'react';
import './LoginPage.css';
// Fetch polyfill
import "promise/polyfill"
import "whatwg-fetch"

type LoginPageProps = {
    user: any,
    setUser: any
}

function LoginPage({user, setUser}: LoginPageProps) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);

    return (
        <div className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-container">
                <p><strong>Login</strong> to view courses in your schedule.</p>
                <form>
                    <div className="form-input-group">
                        <label htmlFor="login-uid">Username</label>
                        <input type="text" name="username" id="login-uid" value={userName} onChange={handleUserNameUpdate}/>
                    </div>
                    <div className="form-input-group">
                        <label htmlFor="login-password">Password</label>
                        <input type="password" name="password" id="login-password" value={password} onChange={handlePasswordUpdate}/>
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

        // The payload to send to the login API.
        const loginPayload: any = {
            password: password,
            username: userName
        };

        // Send the request
        fetch(`${process.env.REACT_APP_API_BASE}/auth`, {
            body: JSON.stringify(loginPayload),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            method: 'post',
            mode: "cors"
        })

        // Process the request and return the json.
            .then((response: any) => {
                return response.json();
            })

            // Evaluate response.
            .then((data: any) => {

                if (data.success) {

                    // Success! Set the user and reset the error flag.
                    setUser(data.user);
                    setIsError(false);
                } else {

                    // We have an error.
                    setIsError(true);
                }
            });

        // Reset username and password inputs after submitting.
        setUserName('');
        setPassword('');

        // Don't let the page reload.
        event.preventDefault();
    }

    /**
     * Handle typing in password input
     *
     * @param event
     */
    function handlePasswordUpdate(event: any) {
        setPassword(event.target.value);
    }

    /**
     * Handle typing in username input
     *
     * @param event
     */
    function handleUserNameUpdate(event: any) {
        setUserName(event.target.value);
    }
}


export default LoginPage;