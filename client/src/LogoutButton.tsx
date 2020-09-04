import * as React from 'react';
import UserStorage from "./Hooks/UserStorage";
import SetUserCallbackInterface from "./Interfaces/SetUserCallbackInterface";
import {UserType} from "./Types/UserType";

type LogoutButtonProps = {
    user: UserType | null,
    setUser: SetUserCallbackInterface
}

/**
 * Logout button
 *
 * @param user
 * @param setUser
 * @constructor
 */
function LogoutButton({user, setUser}: LogoutButtonProps) {
    function handleLogout() {
        UserStorage.clear();
        setUser(null);
    }


    return user ? <button className="logout-link" onClick={handleLogout}>Logout</button> : <span/>;
}

export default LogoutButton;