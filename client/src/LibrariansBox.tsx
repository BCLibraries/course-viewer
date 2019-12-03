import * as React from 'react';
import Course from "./Course";
import './LibrariansBox.css';
import LibrarianCard from "./LibrarianCard";

type LibrariansBoxProps = {
    course: Course,
    loading: boolean
};

/**
 * Display course librarians
 *
 * @param course
 * @param loading
 * @constructor
 */
function LibrariansBox({course, loading}: LibrariansBoxProps) {

    // If we're loading, display a loading placeholder
    if (loading) {
        return (
            <div>
                <div className="ph-librarian-header"/>
                <div className="ph-librarian ph-item">
                    <div className="ph-librarian-image"/>
                    <div className="ph-librarian-info"/>
                    <div className="ph-librarian-info"/>
                </div>
            </div>
        );
    }

    // If we can't find any experts, load a blank box.
    if (!course.subjectInfo || !course.subjectInfo.experts) {
        return (<span/>);
    }


    // Courses can have more than one librarian attached. Display them all.
    const experts = course.subjectInfo.experts;
    const librarianTerm = (experts.length > 1) ? 'librarians' : 'librarian';

    return (
        <div>
            <h4>Your {librarianTerm}</h4>
            {experts.map((expert: any, index: any) =>
                <LibrarianCard key={`librarian-box-index ${index}`} expert={expert}/>)}
        </div>
    );
}

export default LibrariansBox;