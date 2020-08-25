import * as React from 'react';
import {Link} from "react-router-dom";
import './SectionList.css';
import NoCoursesMessage from "./NoCoursesMessage";
import Semester from "../Semester";

const currentSemester = Semester.currentSemester();

type SectionListProps = {
    sections: any[]
};

/**
 * Displays user's current course schedule
 *
 * @param sections
 * @constructor
 */
function SectionList({sections}: SectionListProps) {
    const currentSections = sections.filter(currentSectionFilter).map(sectionFactory);

    return (
        <div className={"schedule"}>
            {currentSections.length > 0 ? currentSections : <NoCoursesMessage/>}
        </div>
    );
}

/**
 * Display a single section
 *
 * @param section
 */
function sectionFactory(section: any) {
    const sectionDisplay = `${section.subjectCode}${section.courseNum}.${section.sectionNum}`;
    const url = `${process.env.PUBLIC_URL}/${section.subjectCode}${section.courseNum}/section/${section.sectionNum}`;
    return (
        <li key={sectionDisplay}>
            <Link to={url}>{sectionDisplay}</Link>
        </li>
    );
}

/**
 * Is this course from this semester?
 *
 * @param section
 */
function currentSectionFilter(section: any) {
    return (section.year === currentSemester.codeYear && section.semester === currentSemester.codeSemester);
}

export default SectionList;