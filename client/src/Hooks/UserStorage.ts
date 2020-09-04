import {IN_IFRAME} from "../InIFrame";
import {UserType} from "../Types/UserType";

// Storage key for the user data in local storage
const storageKey = 'library-reserves-user';

// How long the user data should live in local storage without being touched
const minutesToLive = 20;

/**
 * Store user info
 *
 * Stores information about the User, including who they are and what URL they
 * are looking for. Uses local storage, with the schema:
 *
 * {
 *      "added": 1580844540.288,             // timestamp when record was created
 *      "user": {                            // user response from server
 *          "sections": {
 *              "_sectionsAsStudent": [],
 *              "_sectionsAsInstructor": []
 *          },
 *          "_empty": false,                 // was the record empty?
 *          "uid": "florinb"                 // user name
 *      }
 * }
 */
class UserStorage {

    /**
     * Add the user to local storage
     *
     * @param user
     */
    public static store(user: any) {
        if (window.self === window.top) {

            const storedUser = {
                added: Date.now() / 1000,
                user
            };
            localStorage.setItem(storageKey, JSON.stringify(storedUser));
        }
    }

    /**
     * Set the URL to forward the user to after login
     *
     * @param url
     */
    public static setReturnUrl(url: string) {
        localStorage.setItem('return-to', url);
    }

    /**
     * Get the URL to forward the user to after login
     */
    public static getReturnUrl() {
        const returnTo = localStorage.getItem('return-to');
        localStorage.removeItem('return-to');
        if (returnTo === null || !returnTo.startsWith('http')) {
            return null;
        }
        return this.isHist2015(returnTo) ? null : returnTo;
    }

    /**
     * Get the user from local storage
     *
     * Return the user or null if the user is not found or the last access has expired.
     */
    public static get(): UserType | null {
        let user = null;

        // If we are in an IFrame this is probably an LTI call, and we don't need the
        // user ID. Abort.
        if (IN_IFRAME) {
            return null;
        }


        // Check local storage for data about the user. Abort if nothing is saved to local
        // storage.
        const userString = localStorage.getItem(storageKey);
        if (!userString) {
            return null;
        }


        // Extract a user data object from the JSON string in local storage. Abort if there
        // is no user data set in the object or the last touched date is not set.
        const userStringData = JSON.parse(userString);
        if (!userStringData.user || !userStringData.added) {
            return null;
        }

        // If the user session hasn't expired, load the user data and refresh the last
        // accessed timestamp.
        const oldestAcceptableAccessTime = Date.now() / 1000 - (minutesToLive * 60);
        if (userStringData.added > oldestAcceptableAccessTime) {
            user = userStringData.user;
            UserStorage.store(user);
        }
        return user;
    }

    /**
     * Zero-out the local storage object
     */
    public static clear() {
        if (window.self === window.top) {
            localStorage.removeItem(storageKey);
        }
    }

    /**
     * Check for special circumstances courses
     *
     * @param value
     */
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