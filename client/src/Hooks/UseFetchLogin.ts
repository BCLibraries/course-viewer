import {useEffect, useState} from "react";

export type LoginPayloadType = {
    userName: string,
    password: string
}

/**
 * Custom hook for logging in using LDAP credentials
 *
 * @param setUser
 */
function useFetchLogin(setUser: any): [any, any] {

    // Are we in an error state?
    const [isError, setIsError] = useState<boolean>(false);

    // Login request payload (username, password)
    const [loginPayload, setLoginPayload] = useState<LoginPayloadType | null>(null);

    useEffect(() => {

        /**
         * Send a login request
         */
        async function tryLogin() {
            try {

                // Send the request.
                const result = await fetch(`${process.env.REACT_APP_API_BASE}/auth`, {
                    body: JSON.stringify(loginPayload),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    method: 'post',
                    mode: 'cors'
                });

                // If successful, load the response object.
                const responseJSON = await result.json();
                if (responseJSON.success) {
                    setUser(responseJSON.user);
                    setIsError(false);
                } else {
                    setIsError(true);
                }

            } catch (e) {

                // Calling component will handle the error.
                setIsError(true);
            }
        }

        // AbortController to kill hanging requests and prevent memory leaks.
        const abortController = new AbortController();

        // If there was a request, try to login.
        if (loginPayload) {
            tryLogin();
        }

        return function cleanup() {
            abortController.abort();
        }

    }, [loginPayload, setUser]);

    return [{isError}, setLoginPayload];
}

export default useFetchLogin;