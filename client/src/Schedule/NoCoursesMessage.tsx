import * as React from "react";
import Semester from "../Semester";

const currentSemester = Semester.currentSemester();

function NoCoursesMessage() {
    return (
        <div className="no-courses-box">
            <div className="no-courses-message">
                We could not find any {currentSemester.displaySemester} {currentSemester.displayYear} courses that you are registered for. If you believe you have received
                this message in error, please <a href="https://library.bc.edu/feedback/">contact Boston College
                Libraries support</a>.
            </div>
        </div>
    );
}

export default NoCoursesMessage;