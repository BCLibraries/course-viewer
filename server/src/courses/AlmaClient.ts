import axios from 'axios';
import Citation from "./Citation";
import Course from './Course';
import ReadingList from './ReadingList';

const almaBase = 'https://api-na.hosted.exlibrisgroup.com/almaws/v1';

const webClient = axios.create({timeout: 10000})

async function fetchCourse(course: Course) {
    const query = course.section.includes('X') ? `searchable_ids~${course.code}${course.section}`
        : `code~${course.id} AND section~${course.section}`;

    const localParams = {
        direction: 'ASC',
        limit: 10,
        offset: 0,
        order_by: "code,section",
        q: query
    };

    // Search for courses.
    const courseSearchResponse = await fetchFromAlma('/courses', localParams);
    if (!courseSearchResponse.data.course) {
        return course;
    }
    const activeCourses = courseSearchResponse.data.course.filter(isActive);
    if (activeCourses.length === 0) {
        return course;
    }

    // Fetch course information.
    course.loadFromAlma(activeCourses[0]);
    const courseFetchResponse = await fetchFromAlma('/courses/' + course.id, {});

    if (!courseFetchResponse.data.reading_lists.reading_list[0]) {
        return course;
    }
    const firstList = courseFetchResponse.data.reading_lists.reading_list[0];
    const list = new ReadingList(firstList);
    course.addList(list);

    // Load availability information for physical books.
    try {
        const physicalBooks = list.citations.filter(isPhysicalBook);
        const promises = physicalBooks.map(cite => {
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