import {Client} from "ldapjs";
import {promisify} from "util";
import User from "./User";
import parse from '../auth/LDAPParser';

const ldap = require('ldapjs');

/**
 * Authenticate against LDAP server
 *
 * @param uid
 * @param passwd
 */
async function authenticate(uid: string, passwd: string): Promise<User> {

    // If this is an admin user, we need to authenticate against a different ou.
    const isAdmin = isAdminLogin(uid, passwd);
    const ou = isAdmin ? 'applicationadmins' : 'people';

    if (passwd === '') {
        return Promise.reject('no anonymous binds');
    }

    const client = ldap.createClient({url: process.env.LDAP_URL});

    // Bind. For non-admin users this is also authentication.
    const rdn = `uid=${uid},ou=${ou},dc=bc,dc=edu`;
    const promisifiedBind = promisify(client.bind).bind(client);
    try {
        await promisifiedBind(rdn, passwd);
    } catch (error) {
        return Promise.reject('bind failed');
    }

    // Admin users don't have a UID. Assign a demo UID to them. Useful for
    // testing.
    if (isAdmin) {
        uid = process.env.LDAP_DEMO_USER ? process.env.LDAP_DEMO_USER : '';
    }

    // Populate the user.
    const user = new User(uid);
    user.found();

    // Load their courses.
    await loadCourses(user, client);
    return user;
}

async function loadCourses(user: User, client: Client) {
    const opts = {
        filter: `(uid=${user.uid})`,
        scope: 'sub'
    };
    return new Promise((resolve, reject) => {
        client.search('dc=bc,dc=edu', opts, (error, res) => {

            // Fail on error.
            if (error) {
                reject('LDAP search error');
            }

            // Populate the user with courses.
            res.on('searchEntry', entry => {
                user.sections = parse(entry.object);
                resolve(entry.object);
            });
        });
    });
}

/**
 * Is the UID and password for an LDAP admin?
 *
 * Matches the current UID/password combination against the LDAP admin user in the environment. If
 * the values don't match (or if there is no admin user in the environment) it is not an admin user.
 *
 * @param uid
 * @param passwd
 */
function isAdminLogin(uid: string, passwd: string): boolean {
    const adminPassword = process.env.LDAP_ADMIN_PASSWD ? process.env.LDAP_ADMIN_PASSWD : false;
    const adminUser = process.env.LDAP_ADMIN_USER ? process.env.LDAP_ADMIN_USER : false;

    if (!(adminPassword && adminUser)) {
        return false;
    }

    return (passwd === process.env.LDAP_ADMIN_PASSWD && uid === process.env.LDAP_ADMIN_USER);
}

export default authenticate;