import Course from "./Course";

/**
 * Translate the JSON result into the a client-side Course object
 *
 * @param courseJson
 */
function buildCourse(courseJson: any): Course{
    const course = new Course();
    const match = courseJson.code.match(/([A-Z]{4,6})(\d+X?)/);

    course.code = courseJson.code;
    course.number = match ? match[0] : '';
    course.section = courseJson.section;
    course.name = courseJson.name;
    course.hasReadings = courseJson.has_readings;
    course.subjectInfo = courseJson.subject_info;
    course.researchGuides = courseJson.research_guides;

    // If the course has no readings, return an empty course readings list.
    course.lists = course.hasReadings ? courseJson.reading_lists : [{citations: []}];

    // Course object are saved as state and should be immutable.
    Object.freeze(course);

    return course;
}

/**
 * Fetch a course
 *
 * @param course
 */
async function fetchCourse(course: Course) {
    const courseId = course.subject + course.number;
    const API = buildAPIURL(courseId, course.section);
    const apiResult = await fetch(API);
    return buildCourse(await apiResult.json());
}

function buildAPIURL(courseId: string, sectionId: string) {
    return process.env.REACT_APP_API_BASE + `/courses/${courseId}/sections/${sectionId}`;
}

export default {fetchCourse};