import * as React from 'react';
import {Redirect} from "react-router-dom";
import './LoginPage.css';

/* tslint:disable */

// Fetch polyfill
import "promise/polyfill"
import "whatwg-fetch"

class LoginPage extends React.Component<{}, { username: string, password: string, user: any }> {
    public constructor(props: any) {
        super(props);
        this.state = {username: '', password: '', user: null};

        this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
        this.handleUsernameUpdate = this.handleUsernameUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        let mainContent = <form>
            <div className="form-input-group">
                <label htmlFor="login-uid">Username</label>
                <input type="text" name="username" id="login-uid" onChange={this.handleUsernameUpdate}/>
            </div>
            <div className="form-input-group">
                <label htmlFor="login-password">Password</label>
                <input type="password" name="password" id="login-password" onChange={this.handlePasswordUpdate}/>
            </div>
            <input type="submit" value="Login"/>
        </form>;

        if (this.state.user) {
            mainContent = <Redirect
                to={{
                    pathname: `${process.env.PUBLIC_URL}/schedule`,
                    state: {user: this.state.user}
                }}
            />;
        }


        return (
            <div className="login-form" onSubmit={this.handleSubmit}>
                {mainContent}
            </div>);
    }

    private handleSubmit(event: React.FormEvent<HTMLDivElement>) {
        const loginPayload: any = {
            password: this.state.password,
            username: this.state.username
        };

        fetch(`${process.env.REACT_APP_API_BASE}/auth`, {
            body: JSON.stringify(loginPayload),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            method: 'post',
            mode: "cors"
        }).then((response: any) => {
            return response.json();
        }).then((data: any) => {
            if (data.success) {
                this.setState({user: data.user});
            }

        });
        event.preventDefault();
    }

    private handlePasswordUpdate(event: any) {
        const value = event.target.value;
        this.setState({password: value});
    }

    private handleUsernameUpdate(event: any) {
        const value = event.target.value;
        this.setState({username: value})
    }
}

export default LoginPage;