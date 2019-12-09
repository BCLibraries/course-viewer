import * as React from 'react';
import Course from './Course';

type LibrariesHeaderProps = {
    course: Course
};

/**
 * Header for page
 *
 * @param course
 * @constructor
 */
function LibrariesHeader({course}: LibrariesHeaderProps) {

    // If we don't have a viable course, don't display a header.
    if (!course.number) {
        return (<div className="course-name placeholder"/>);
    }

    return (
        <h2 className="course-name">
            <span className="course-id">{course.subject}{course.number}-{course.section} </span>
            {course.name}
        </h2>
    );
}

export default LibrariesHeader;