import Course from "./Course";

function buildStateCourse(courseJson: any, course: Course) {
    course.code = courseJson.code;
    course.name = courseJson.name;
    course.lists = courseJson.reading_lists;
    course.hasReadings = courseJson.has_readings;
    course.subjectInfo = courseJson.subject_info;
    return course;
}

async function fetchCourse(course: Course) {
    const courseId = course.subject + course.number;
    const API = buildAPIURL(courseId, course.section);
    const apiResult = await fetch(API);
    return buildStateCourse(await apiResult.json(), course);
}

function buildAPIURL(courseId: string, sectionId: string) {
    return process.env.REACT_APP_API_BASE + `/courses/${courseId}/sections/${sectionId}`;
}

export default {fetchCourse};