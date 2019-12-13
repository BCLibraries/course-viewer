import cache from '../Cache';

/**
 * Lookup librarians and subject guides for a subject
 *
 * @param subjectCodes
 */
function fetchSubject(subjectCodes: string[]) {

    // Subject entries exist only in Redis for now, so they are by definition cached.
    return cache.lookupSubject(subjectCodes);
}

export default fetchSubject;
