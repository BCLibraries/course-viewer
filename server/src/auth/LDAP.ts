import bunyan from "bunyan";
import {Client} from "ldapjs";
import {promisify} from "util";
import {ICourse, User} from "./User";

const ldap = require('ldapjs');

const logger = bunyan.createLogger({
    name: 'ldap',
    streams: [{
        level: 'debug',
        path: '/tmp/ldap.log',
    }],
});

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
    getCourses(user, client);
    return user;
}

async function getCourses(user: User, client: Client) {
    const promisifiedSearch = promisify(client.search).bind(client);
    const opts = {
        filter: `(uid=${user.uid})`,
        scope: 'sub'
    };
    const searchResult = await promisifiedSearch('dc=bc,dc=edu', opts);


    //const search_response = await promisifiedSearch('dc=bc,dc=edu', opts);
}

function compileResult(searchResult: any) {
    const courses: string[] = [];

    return new Promise((resolve, reject) => {
        searchResult.on('searchEntry', (entry: any) => {
            const course: ICourse = {
                courseNum: 'foo',
                sectionNum: 'bar'
            };
            console.log(entry);
        });

        searchResult.on("end", (retVal: any) => {
            console.log('end');
            console.log(retVal);
        });
    });
}

export default authenticate;