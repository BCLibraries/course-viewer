import * as React from 'react';
import UserStorage from "./UserStorage";
import {Redirect} from "react-router";

type LogoutButtonProps = {
    user: any,
    setUser: any
}

function LogoutButton({user, setUser}: LogoutButtonProps) {
    function handleLogout() {
        UserStorage.clear();
        setUser(null);
    }

    return user ? <button className="logout-link" onClick={handleLogout}>Logout</button> :
        <Redirect to={process.env.PUBLIC_URL}/>;
}

export default LogoutButton;