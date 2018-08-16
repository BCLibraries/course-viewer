import axios, {AxiosInstance} from 'axios';
import cache from "../Cache";
import Citation from "./Citation";
import Course from './Course';
import ReadingList from './ReadingList';

const webClient = axios.create({timeout: 20000});
scheduleRequests(webClient, 200);

const activeListStatuses: any = ['complete', 'beingprepared', 'being prepared'];

async function fetchCourse(course: Course) {
    // Search for the course in Alma.
    const courseFromAlma = await searchForCourse(course);
    if (!courseFromAlma) {
        return course;
    }
    course.loadFromAlma(courseFromAlma);

    // Load any reading lists.
    const readingList = await fetchReadingList(course);
    if (!readingList) {
        return course;
    }
    course.addList(readingList);

    // Load availability information for physical books.
    try {
        const physicalBooks = readingList.citations.filter(isPhysicalItem);
        const promises = physicalBooks.map( (cite: any) => {
            return fetchAvailability(cite);
        });
        const availabilityResults = await Promise.all(promises);
        availabilityResults.forEach((result: any, citationNumber: number) => {
                physicalBooks[citationNumber].setAvailability(result.data.anies[0]);
            }
        );
    } catch (e) {
        console.log(e.message);
        // Don't fail if availability information isn't available, just return the list.
    }

    return course;
}

async function searchForCourse(course: Course) {
    let query = '';
    if (course.section.includes('X')) {
        query = `searchable_ids~${course.code}.${course.section}`;
    } else if (course.section === '') {
        query = `searchable_ids~${course.code}`;
    } else {
        query = `code~${course.code} AND section~${course.section}`;
    }

    const localParams = {
        direction: 'ASC',
        limit: 10,
        offset: 0,
        order_by: "code,section",
        q: query
    };

    let courseFromAlma = await cache.fetchCourseSearch(course);
    if (!courseFromAlma) {
        // Search for courses.
        const courseSearchResponse = await fetchFromAlma('/courses', localParams);
        if (courseSearchResponse.data.course) {
            const activeCourses = courseSearchResponse.data.course.filter(isActive);
            if (activeCourses.length > 0) {
                courseFromAlma = activeCourses[0];
                cache.saveCourseSearch(course, courseFromAlma);
            }
        }
    }
    return courseFromAlma;
}

async function fetchReadingList(course: Course) {
    let readingList = await cache.fetchReadingList(course);

    // If list wasn't cached, fetch it.
    if (!readingList) {
        const courseFetchResponse = await fetchFromAlma('/courses/' + course.id, {});

        if (courseFetchResponse.data.reading_lists.reading_list) {
            const filteredLists = courseFetchResponse.data.reading_lists.reading_list.filter(listIsActive);
            if (filteredLists[0]) {
                readingList = filteredLists[0];
                cache.saveReadingList(course, readingList);
            }
        }
    }
    return new ReadingList(readingList);
}

function listIsActive(list:any) {
    return activeListStatuses.includes(list.status.value.toLowerCase());
}

async function fetchFromAlma(url: string, localParams: any) {
    const baseParams = {
        apikey: process.env.ALMA_APIKEY,
        format: "json",
        view: "full"
    };

    const params = {...baseParams, ...localParams};
    return webClient.get(process.env.ALMA_API_BASE + url, {params});
}

function isActive(course: Course) {
    return course.status === "ACTIVE";
}

function isPhysicalItem(cite: Citation) {
    const isPhysical = cite.type.primary === 'Physical Book';
    return isPhysical && !isEBook(cite);
}

function isEBook(cite: Citation) {
    const typeIsEbook = cite.type.primary === 'Physical Book' && cite.type.secondary === 'E-book';
    const hasEbookInTitle = cite.metadata.title.match(/[eE]-?book/);
    return typeIsEbook || hasEbookInTitle;
}

function fetchAvailability(cite: Citation) {
    const mms_id = cite.metadata.mms_id;
    return fetchFromAlma('/bibs/' + mms_id, {expand: 'p_avail'});
}

/**
 * Throttle Alma requests to keep in line with API limits
 *
 * Courtesy galenus@StackOverflow
 * https://stackoverflow.com/questions/43482639/throttling-axios-requests
 */
function scheduleRequests(axiosInstance:AxiosInstance, intervalMs: number) {
    let lastInvocationTime:number = 0;

    const scheduler = (config:any) => {
        const now = Date.now();
        if (lastInvocationTime) {
            lastInvocationTime += intervalMs;
            const waitPeriodForThisRequest = lastInvocationTime - now;
            if (waitPeriodForThisRequest > 0) {
                return new Promise((resolve) => {
                    setTimeout(
                        () => resolve(config),
                        waitPeriodForThisRequest);
                });
            }
        }

        lastInvocationTime = now;
        return config;
    };

    axiosInstance.interceptors.request.use(scheduler);
}

module.exports = {
    fetchCourse
};