import cache from '../Cache';

function fetchSubject(subjectCode: string) {
    return cache.lookupSubject(subjectCode);
}

export default fetchSubject;
