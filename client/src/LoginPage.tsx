import * as React from 'react';
import './LoginPage.css';
import UserStorage from './UserStorage';

// Fetch polyfill
import "promise/polyfill"
import "whatwg-fetch"
import SectionList from "./SectionList";

class LoginPage extends React.Component<{ user: any, setUser: any }, { username: string, password: string, error: boolean }> {
    public constructor(props: any) {
        super(props);
        this.state = {username: '', password: '', error: false};

        this.handleLogout = this.handleLogout.bind(this);
        this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
        this.handleUsernameUpdate = this.handleUsernameUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        let errorMessage = <span/>;

        if (this.state.error) {
            errorMessage = <div className="login-error">There was a problem with your username or password</div>;
        }

        let mainContent =
            <div className="login-form-container">
                <p><strong>Login</strong> to view courses in your schedule.</p>
                <form>
                    <div className="form-input-group">
                        <label htmlFor="login-uid">Username</label>
                        <input type="text" name="username" id="login-uid" value={this.state.username} onChange={this.handleUsernameUpdate}/>
                    </div>
                    <div className="form-input-group">
                        <label htmlFor="login-password">Password</label>
                        <input type="password" name="password" id="login-password" value={this.state.password} onChange={this.handlePasswordUpdate}/>
                    </div>
                    <input type="submit" value="Login"/>
                    {errorMessage}
                </form>
            </div>;

        if (this.props.user) {
            mainContent = <div>
                <SectionList sections={this.props.user.sections._sectionsAsStudent}/>
                <a className="logout-link" onClick={this.handleLogout}>Logout</a>
            </div>;
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
                this.props.setUser(data.user);
                this.setState({error: false});
            } else {
                this.setState({error: true});
            }
        });
        this.setState({username: '', password: ''});
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

    private handleLogout(event: any) {
        UserStorage.clear();
        this.props.setUser(null);
    }
}

export default LoginPage;