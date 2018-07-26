import cache from '../Cache';

function lookup(subjectCode: string) {
    return cache.lookupSubject(subjectCode);
}

export default lookup;
