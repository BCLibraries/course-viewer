import redis from 'redis';
import {promisify} from "util";
import Course from "./courses/Course";

/**
 * Promisified redis lookup to avoid callback hell
 */
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const mgetAsync = promisify(client.mget).bind(client);

// Convenience constants to avoid mystery numbers.
const MINUTE_IN_SECONDS = 60;
const DAY_IN_SECONDS = 24 * 60 * MINUTE_IN_SECONDS;

/**
 * Cache for storing values locally
 */
class Cache {
    private static courseSearchKey(course: Course) {
        return `bcreserves-alma-course-search-${course.code}${course.section}`;
    }

    private static readingListKey(course: Course) {
        return `bcreserves-alma-reading-list-${course.id}`;
    }

    public lookupSubject(subjectCodes: string[]) {
        subjectCodes = subjectCodes.map(code => (`bc-subj-${code}`));
        return mgetAsync(subjectCodes);
    }

    public saveCourseSearch(course: Course, almaSearchResult: any) {
        const courseJSON = JSON.stringify(almaSearchResult);
        client.set(Cache.courseSearchKey(course), courseJSON, 'EX', DAY_IN_SECONDS);
    }

    public async fetchCourseSearch(course: Course) {
        const courseJson = await getAsync(Cache.courseSearchKey(course));
        return JSON.parse(courseJson);
    }

    public saveReadingList(course: Course, courseFromAlma: any) {
        const courseJSON = JSON.stringify(courseFromAlma);
        client.set(Cache.readingListKey(course), courseJSON, 'EX', 5 * MINUTE_IN_SECONDS);
    }

    public async fetchReadingList(course: Course) {
        const courseJson = await getAsync(Cache.readingListKey(course));
        return JSON.parse(courseJson);
    }
}

const cache = new Cache();

export default cache;