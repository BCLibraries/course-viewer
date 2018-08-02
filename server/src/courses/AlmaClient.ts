import axios from 'axios';
import cache from "../Cache";
import Citation from "./Citation";
import Course from './Course';
import ReadingList from './ReadingList';

const almaBase = 'https://api-na.hosted.exlibrisgroup.com/almaws/v1';

const webClient = axios.create({timeout: 10000});

async function fetchCourse(course: Course) {
    console.log('fetching...');

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
        const physicalBooks = readingList.citations.filter(isPhysicalBook);
        const promises = physicalBooks.map((cite: any) => {
            return fetchAvailability(cite);
        });
        const availabilityResults = await Promise.all(promises);
        availabilityResults.forEach((result: any, citationNumber: number) => {
                physicalBooks[citationNumber].setAvailability(result.data.anies[0]);
            }
        );
    } catch (e) {

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

    console.log(query);

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

        if (courseFetchResponse.data.reading_lists.reading_list[0]) {
            readingList = courseFetchResponse.data.reading_lists.reading_list[0];
            cache.saveReadingList(course, readingList);
        }
    }
    return new ReadingList(readingList);
}

function fetchFromAlma(url: string, localParams: any) {
    const baseParams = {
        apikey: process.env.ALMA_APIKEY,
        format: "json",
        view: "full"
    };

    const params = {...baseParams, ...localParams};
    return webClient.get(almaBase + url, {params});
}

function isActive(course: Course) {
    return course.status === "ACTIVE";
}

function isPhysicalBook(cite: Citation) {
    const isBook = cite.type.primary === 'Physical Book' && cite.type.secondary !== 'Video';
    return isBook && !isEBook(cite);
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

module.exports = {
    fetchCourse
};