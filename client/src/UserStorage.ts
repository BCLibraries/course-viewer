const storageKey = 'reserves-user';
const minutesToLive = 20;

class UserStorage {
    public static store(user: any) {
        const storedUser = {
            added: Date.now() / 1000,
            user
        };
        localStorage.setItem(storageKey, JSON.stringify(storedUser));
    }

    public static get() {
        let user = null;
        const userString = localStorage.getItem(storageKey);
        const twentyMinutesAgo = Date.now() / 1000 - (minutesToLive * 60);
        if (userString) {
            const userStringData = JSON.parse(userString);
            if (userStringData.added > twentyMinutesAgo) {
                user = userStringData.user;
                UserStorage.store(user);
            }
        }
        return user;
    }

    public static clear() {
        localStorage.removeItem(storageKey);
    }
}

export default UserStorage;