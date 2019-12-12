import * as React from 'react';
import UserStorage from "./UserStorage";

type LogoutButtonProps = {
    user: any,
    setUser: any
}

function LogoutButton({user, setUser}: LogoutButtonProps) {
    function handleLogout() {
        UserStorage.clear();
        setUser(null);
    }


    return user ? <button className="logout-link" onClick={handleLogout}>Logout</button> : <span/>;
}

export default LogoutButton;