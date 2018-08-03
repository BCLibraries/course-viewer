import {Client} from "ldapjs";
import {promisify} from "util";
import {User} from "./User";

import logger from "../Logger";

const ldap = require('ldapjs');

async function authenticate(uid: string, passwd: string): Promise<User> {
    const user = new User(uid);
    if (passwd === '') {
        return Promise.reject('no anonymous binds');
    }

    const client = ldap.createClient({url: process.env.LDAP_URL, log: logger});
    const rdn = `uid=${uid},ou=people,dc=bc,dc=edu`;
    const promisifiedBind = promisify(client.bind).bind(client);
    try {
        await promisifiedBind(rdn, passwd);
    } catch (error) {
        return Promise.reject('bind failed');
    }
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
                resolve(user);
            });
        });
    });
}

export default authenticate;