import Course from "../Course";
import {useEffect, useState} from "react";

/**
 * Custom hook for fetching course information from API
 *
 * @param subject
 * @param number
 * @param section
 */
function useFetchCourse(subject: string, number: string, section: string) {

    const [isLoading, setIsLoading] = useState(false);
    const [course, setCourse] = useState(new Course());

    // API url
    const url = process.env.REACT_APP_API_BASE + `/courses/${subject}${number}/sections/${section}`;

    useEffect(() => {

        // AbortController to kill hanging requests and prevent memory leaks.
        const abortController = new AbortController();

        //  Fetch the course.
        const fetchCourse = async () => {
            setIsLoading(true);
            const apiResult = await fetch(url);
            setCourse(buildCourse(await apiResult.json()));
            setIsLoading(false);
        };
        fetchCourse();

        return function cleanup() {
            abortController.abort();
        }
    },[url]);

    // @TODO: Add error return from UseFetchCourse
    return [{isLoading, course}];
}

/**
 * Translate the JSON result into the a client-side Course object
 *
 * @param courseJson
 */
function buildCourse(courseJson: any): Course {
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

export default useFetchCourse;