import Course from "./Course";
import * as React from "react";

type LinkToLibraryProps = {
    course: Course
};

/**
 * A link back to the library
 *
 * The Law School uses reserves in Canvas too, and they would prefer that links back to "the library" go to them,
 * not the Boston College Libraries general page.
 *
 */
function LinkToLibrary({course}: LinkToLibraryProps) {
    const text = course.isLawSchool() ? 'Boston College Law Library' : 'Boston College Libraries';
    const url = course.isLawSchool() ? 'https://www.bc.edu/bc-web/schools/law/sites/current-students/library' : 'https://library.bc.edu';

    return (
        <div className="library-info">
            <a href={url} target="_blank" className="link-to-libraries">{text}</a>
        </div>
    );
}

export default LinkToLibrary;