import cache from '../Cache';

function fetchSubject(subjectCodes: string[]) {
    return cache.lookupSubject(subjectCodes);
}

export default fetchSubject;
