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

    // Hopefully it's cached and we won't have to fetch from Alma.
    let courseFromAlma = await cache.fetchCourseSearch(course);

    if (courseFromAlma) {
        course.loadFromAlma(courseFromAlma);
        return course;
    }

    // First look up by course and section.
    courseFromAlma = await findActiveCourse(`code~${code} AND section~${section}`);

    // If that fails, look up with an identifier built from the course and section.
    if (!courseFromAlma) {
        courseFromAlma = await findActiveCourse(`searchable_ids~${code}.${section}`);
    }

    // If that fails, use just the course code as an identifier.
    if (!courseFromAlma) {
        courseFromAlma = await findActiveCourse(`searchable_ids~${code}`);
    }

    if (courseFromAlma) {
        course.loadFromAlma(courseFromAlma);
        cache.saveCourseSearch(course, courseFromAlma);
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
    let courseFromAlma = null;
    const courseSearchResponse = await fetchFromAlma('/courses', searchParams(query));
    if (courseSearchResponse.data.course) {
        courseFromAlma = getActiveCourse(courseSearchResponse.data.course);
    }
    return courseFromAlma;
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