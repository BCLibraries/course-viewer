import redis from 'redis';
import {promisify} from "util";
import Course from "./courses/Course";

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

const minuteInSeconds = 60;
const dayInSeconds = 24 * 60 * 60;

class Cache {
    private static courseSearchKey(course: Course) {
        return `bcreserves-alma-course-search-${course.code}${course.section}`;
    }

    private static readingListKey(course: Course) {
        return `bcreserves-alma-reading-list-${course.id}`;
    }

    public lookupSubject(subjectCode: string) {
        return getAsync(`bc-subj-${subjectCode}`);
    }

    public saveCourseSearch(course: Course, almaSearchResult: any) {
        const courseJSON = JSON.stringify(almaSearchResult);
        client.set(Cache.courseSearchKey(course), courseJSON, 'EX', dayInSeconds);
    }

    public async fetchCourseSearch(course: Course) {
        const courseJson = await getAsync(Cache.courseSearchKey(course));
        return JSON.parse(courseJson);
    }

    public saveReadingList(course: Course, courseFromAlma: any) {
        const courseJSON = JSON.stringify(courseFromAlma);
        client.set(Cache.readingListKey(course), courseJSON, 'EX', 5 * minuteInSeconds);
    }

    public async fetchReadingList(course: Course) {
        const courseJson = await getAsync(Cache.readingListKey(course));
        return JSON.parse(courseJson);
    }
}

const cache = new Cache();

export default cache;