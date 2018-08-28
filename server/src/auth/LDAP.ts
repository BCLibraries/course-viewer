import {Client} from "ldapjs";
import {promisify} from "util";
import User from "./User";
import parse from '../auth/LDAPParser';

import logger from "../Logger";

const ldap = require('ldapjs');

async function authenticate(uid: string, passwd: string): Promise<User> {
    const isAdmin = isAdminLogin(uid, passwd);

    const ou = isAdmin ? 'applicationadmins' : 'people';

    if (passwd === '') {
        return Promise.reject('no anonymous binds');
    }

    const client = ldap.createClient({url: process.env.LDAP_URL});

    const rdn = `uid=${uid},ou=${ou},dc=bc,dc=edu`;
    const promisifiedBind = promisify(client.bind).bind(client);
    try {
        await promisifiedBind(rdn, passwd);
    } catch (error) {
        return Promise.reject('bind failed');
    }

    if (isAdmin) {
        uid = process.env.LDAP_DEMO_USER ? process.env.LDAP_DEMO_USER : '';
    }

    const user = new User(uid);
    user.found();

    await getCourses(user, client);
    return user;
}

async function getCourses(user: User, client: Client) {
    await search(user, client);
}

async function search(user: User, client: Client) {
    const opts = {
        filter: `(uid=${user.uid})`,
        scope: 'sub'
    };
    return new Promise((resolve, reject) => {
        client.search('dc=bc,dc=edu', opts, (error, res) => {
            if (error) {
                reject('LDAP search error');
            }
            res.on('searchEntry', entry => {
                user.sections = parse(entry.object);
                resolve(entry.object);
            });
        });
    });
}

function isAdminLogin(uid: string, passwd: string): boolean {
    const adminPassword = process.env.LDAP_ADMIN_PASSWD ? process.env.LDAP_ADMIN_PASSWD : false;
    const adminUser = process.env.LDAP_ADMIN_USER ? process.env.LDAP_ADMIN_USER : false;

    if (!(adminPassword && adminUser)) {
        return false;
    }

    return (passwd === process.env.LDAP_ADMIN_PASSWD && uid === process.env.LDAP_ADMIN_USER);
}

export default authenticate;