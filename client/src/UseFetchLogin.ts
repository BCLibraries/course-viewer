import {useEffect, useState} from "react";

export type LoginPayloadType = {
    userName: string,
    password: string
}

function useFetchLogin(setUser: any): [any, any] {
    const [isError, setIsError] = useState<boolean>(false);
    const [loginPayload, setLoginPayload] = useState<LoginPayloadType | null>(null);

    useEffect(() => {
        // AbortController to kill hanging requests and prevent memory leaks.
        const abortController = new AbortController();

        const tryLogin = async () => {
            try {
                const result = await fetch(`${process.env.REACT_APP_API_BASE}/auth`, {
                    body: JSON.stringify(loginPayload),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    method: 'post',
                    mode: "cors"
                });
                const responseJSON = await result.json();
                setUser(responseJSON.user);
                setIsError(false);
            } catch (e) {
                setIsError(true);
            }
        };
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