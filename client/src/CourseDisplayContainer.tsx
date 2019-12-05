import * as React from "react";
import {useEffect, useState} from "react";
import {Redirect} from "react-router";
import Client from "./Client";
import Course from "./Course";
import LibrariansBox from "./LibrariansBox";
import LibrariesHeader from "./LibrariesHeader";
import ResearchGuidesBox from "./ResearchGuidesBox";
import UserStorage from "./UserStorage";
import QueryString from "./QueryString";
import {IN_IFRAME} from "./InIFrame";
import LinkToLibrary from "./LinkToLibrary";
import ReadingsListPlaceholder from "./ReadingList/ReadingsListPlaceholder";
import ReadingListContainer from "./ReadingList/ReadingListContainer";
import CourseDisplay from "./CourseDisplay";

type CourseDisplayContainerProps = {
    match: any,           // Result of a regex query for course and section info in the request URI
    user: any,            // The logged-in user.
    location: any         // The original request URI
};

/**
 * Logic necessary for loading and displaying a course
 *
 * @param match
 * @param user
 * @param location
 * @constructor
 */
function CourseDisplayContainer({match, user, location}: CourseDisplayContainerProps) {
    const [course, setCourse] = useState(seedCourse(match));
    const [isLoading, setIsLoading] = useState(false);

    // Send what we know about the course for Alma to build a more complete course.
    useEffect(() => {

        // The page title is a side effect, so set it here in useEffect.
        document.title = `${course.subject}${course.number}-${course.section} resources - Boston College Libraries`;

        const fetchCourse = async () => {
            setIsLoading(true);
            Client.fetchCourse(course)
                .then((newCourse: Course) => {
                    setIsLoading(false);
                    setCourse(newCourse);
                });
        };
        fetchCourse();

    }, []);

    // If we are not in an IFrame and don't have a user, redirect to the front page where the user can log in.
    if (IN_IFRAME && !user) {
        return redirectToLogin(location);
    }

    // There are lots of parameters that effect how to display the course information. Build a list of
    // all the relevant CSS classes to apply.
    const classes = determineDisplayClasses(isLoading, course);

    // Function to display the appropriate library header.
    const renderHeader = () => <LibrariesHeader course={course}/>;

    // Show readings list or placeholder.
    const readings = course.hasReadings ? course.lists[0].citations : [];
    const readingsList = isLoading ? <ReadingsListPlaceholder/> : <ReadingListContainer readings={readings}/>;

    return <CourseDisplay classes={classes}
                          renderHeader={renderHeader}
                          readingList={readingsList}
                          researchGuides={<ResearchGuidesBox course={course} loading={isLoading}/>}
                          linkToLibrary={<LinkToLibrary course={course}/>}
                          librarians={<LibrariansBox course={course} loading={isLoading}/>}
    />;
}

/**
 * Build a stub course
 *
 * We can determine some information about the course from just the URL. Use this information (perhaps the course ID
 * and section, or maybe the course_sis_id from Canvas) to build a stub course that we can use to generate a bare-bones
 * course display and query the Alma API.
 *
 * @param match
 */
function seedCourse(match: any): Course {

    // Prefer to build the course from course and section IDs if we have them.
    const params = match.params;
    if (params.course_id && params.section_id) {
        params.course_id = params.course_id.toUpperCase();
        return Course.buildFromCourseAndSection(params.course_id, params.section_id);
    }

    // Otherwise, check the query string for a Canvas course_sis_id.
    const queryString = new QueryString();
    if (queryString.hasValue('course_sis_id')) {
        const course_sis_id: any = queryString.getValue('course_sis_id');
        Course.buildFromId(course_sis_id ? course_sis_id : '');
    }

    // If you've got nothing, return a blank course.
    return new Course();
}

/**
 * Figure out classes we need to set for display
 *
 * @param isLoading
 * @param course
 */
function determineDisplayClasses(isLoading: boolean, course: Course) {
    const classes: string[] = ['App'];

    // Show placeholders when loading.
    classes.push(isLoading ? 'loading' : 'loaded');

    // If we are in an IFrame, we're probably being displayed in Canvas.
    classes.push(IN_IFRAME ? 'lti-style' : 'libraries-style');

    // Just show resources if there are no readings.
    if (!isLoading) {
        classes.push(course.hasReadings ? 'has-readings' : 'no-readings');
    }

    return classes;
}

/**
 * Redirect to login page
 *
 * @param location
 */
function redirectToLogin(location: any) {
    try {
        // Store the current URL so we can send the user back to it after login.
        UserStorage.setReturnUrl(location.pathname);
    } catch (e) {
        // Storage failed? Don't worry—they'll figure it out.
    }
    return <Redirect push={true} to={{pathname: `${process.env.PUBLIC_URL}/`,}}/>
}

export default CourseDisplayContainer;