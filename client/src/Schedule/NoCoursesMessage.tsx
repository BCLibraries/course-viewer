import * as React from "react";

function NoCoursesMessage() {
    return (
        <div className="no-courses-box">
            <div className="no-courses-message">
                We could not find any Spring 2020 courses that you are registered for. If you believe you have received
                this message in error, please <a href="https://library.bc.edu/feedback/">contact Boston College
                Libraries support</a>.
            </div>
        </div>
    );
}

export default NoCoursesMessage;