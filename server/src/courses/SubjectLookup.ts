import redis from 'redis';
import {promisify} from 'util';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

function lookup(subjectCode: string) {
    return getAsync(`bc-subj-${subjectCode}`);
}

export default lookup;
