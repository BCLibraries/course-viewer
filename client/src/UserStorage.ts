const storageKey = 'library-reserves-user';
const minutesToLive = 20;

class UserStorage {
    public static store(user: any) {
        if (window.self === window.top) {

            const storedUser = {
                added: Date.now() / 1000,
                user
            };
            localStorage.setItem(storageKey, JSON.stringify(storedUser));
        }
    }

    public static setReturnUrl(url: string) {
        localStorage.setItem('return-to', url);
    }

    public static getReturnUrl() {
        const returnTo = localStorage.getItem('return-to');
        localStorage.removeItem('return-to');
        if (returnTo === null || !returnTo.startsWith('http')) {
            return null;
        }
        return this.isHist2015(returnTo) ? null : returnTo;
    }

    public static get() {
        let user = null;
        if (window.self === window.top) {
            const userString = localStorage.getItem(storageKey);
            const twentyMinutesAgo = Date.now() / 1000 - (minutesToLive * 60);
            if (userString) {
                const userStringData = JSON.parse(userString);
                if (userStringData.added && userStringData.added > twentyMinutesAgo) {
                    user = userStringData.user;
                    UserStorage.store(user);
                }
            }
        }
        return user;
    }

    public static clear() {
        if (window.self === window.top) {
            localStorage.removeItem(storageKey);
        }
    }

    // Check for
    private static isHist2015(value: string | null) {
        if (value === null) {
            return false;
        }

        if (value.includes('HIST2015') || value.includes('hist2015') || value.includes('HISIT')) {
            return true;
        }

        return false;
    }
}

export default UserStorage;