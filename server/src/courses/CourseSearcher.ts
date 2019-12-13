import cache from "../Cache";
import fetchFromAlma from './AlmaClient';
import Course from './Course';

/**
 * Search for a course
 *
 * @param code
 * @param section
 */
async function searchForCourse(code: string, section: string): Promise<Course> {
    const course = new Course();
    course.code = code;
    course.section = section;

    // Hopefully it's cached and we won't have to fetch from Alma. The cached form of the course is the reified
    // course object from the Alma API JSON response, not a Course object.
    let courseJSON = await cache.fetchCourseSearch(course);

    // If the course was in cache, convert it to a Course object and return.
    if (courseJSON) {
        course.loadFromAlma(courseJSON);
        return course;
    }

    // Not in cache? First look up by course and section.
    courseJSON = await findActiveCourse(`code~${code} AND section~${section}`);

    // If that fails, look up with an identifier built from the course and section.
    if (!courseJSON) {
        courseJSON = await findActiveCourse(`searchable_ids~${code}.${section}`);
    }

    // If that fails, use just the course code as an identifier.
    if (!courseJSON) {
        courseJSON = await findActiveCourse(`searchable_ids~${code}`);
    }

    // If we found a course, convert it to a Course object and cache it.
    if (courseJSON) {
        course.loadFromAlma(courseJSON);
        cache.saveCourseSearch(course, courseJSON);
    }

    return course;
}

/**
 * Return a parameters object for a course search
 *
 * @param query
 */
function searchParams(query: string) {
    return {
        direction: 'ASC',
        limit: 10,
        offset: 0,
        order_by: "code,section",
        q: query
    };
}

/**
 * Send a request to Alma and return the first active course
 *
 * @param query
 */
async function findActiveCourse(query: string) {
    const searchResponse = await fetchFromAlma('/courses', searchParams(query));
    return searchResponse.data.course ? getActiveCourse(searchResponse.data.course) : null;
}

/**
 * Get the first active course in a list
 *
 * @param courseList
 */
function getActiveCourse(courseList: any) {
    const activeCourses = courseList.filter((course: any) => course.status === "ACTIVE");
    return activeCourses[0] ? activeCourses[0] : null;
}

export default searchForCourse;