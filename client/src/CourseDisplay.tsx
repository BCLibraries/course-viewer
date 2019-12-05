import * as React from "react";
import {useEffect, useState} from "react";
import {Redirect, Route} from "react-router";
import Client from "./Client";
import Course from "./Course";
import LibrariansBox from "./LibrariansBox";
import LibrariesHeader from "./LibrariesHeader";
import './Placeholder.css';
import ReadingList from "./ReadingList";
import ResearchGuidesBox from "./ResearchGuidesBox";
import UserStorage from "./UserStorage";
import QueryString from "./QueryString";
import {IN_IFRAME} from "./InIFrame";
import LinkToLibrary from "./LinkToLibrary";

type CourseDisplayProps = {
    match: any,           // Result of a regex query for course and section info in the request URI
    user: any,            // The logged-in user.
    location: any         // The original request URI
};

function CourseDisplay({match, user, location}: CourseDisplayProps) {
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

    return (
        <div className={classes.join(' ')}>
            <Route path={`${process.env.PUBLIC_URL}/:course_id/section/:section_id`} render={renderHeader}/>

            <div className={'app-container'}>
                <div className="readings">
                    <div className={"readings-header"}>
                        <h2>Readings</h2>
                    </div>
                    {isLoading ? loadingPage() : readingsDisplay(course)}
                </div>
                <LinkToLibrary course={course}/>
                <div className="research-guides">
                    <ResearchGuidesBox course={course} loading={isLoading}/>
                </div>
                <div className="librarian">
                    <LibrariansBox course={course} loading={isLoading}/>
                    <a onClick={openChat} className={"chat-link btn btn-primary"}>Chat with us <i className={"fa fa-commenting-o"}/></a>
                </div>
            </div>
        </div>
    );
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
    if (isLoading) {
        classes.push(course.hasReadings ? 'has-readings' : 'no-readings');
    }

    return classes;
}

function readingsDisplay(course: Course) {
    return (course.hasReadings) ? (<ReadingList readings={course.lists[0].citations}/>) :
        (<div className="no-readings-box">
            <div className="no-readings-message">No reserve readings were found for this section.</div>
        </div>);
}

/**
 * Redirect to login page
 *
 * @param location
 */
function redirectToLogin(location: any) {
    try {
        // Store the current URL so we can send them back to it after login.
        UserStorage.setReturnUrl(location.pathname);
    } catch (e) {
        // Storage failed? Don't worry.
    }
    return <Redirect push={true} to={{pathname: `${process.env.PUBLIC_URL}/`,}}/>
}

function loadingPage(): any {
    return (
        <ul className="is-loading">
            {readingsLoading()}
            {readingsLoading()}
            {readingsLoading()}
            {readingsLoading()}
            {readingsLoading()}
        </ul>
    );
}

function readingsLoading(): any {
    return (
        <li className="physical-book ph-item">
            <div className="thumbnail"/>
            <div className="book-ph-line"/>
            <div className="book-ph-line"/>
            <div className="book-ph-line"/>
        </li>
    );
}

/**
 * Open an AJCU chat service window
 */
function openChat() {
    window.open('https://library.bc.edu/chat', 'chat', 'resizable=1,width=320,height=300')
}


export default CourseDisplay;