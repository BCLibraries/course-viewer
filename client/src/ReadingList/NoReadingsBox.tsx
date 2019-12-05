import React from "react";

/**
 * Display when a course doesn't have readings
 *
 * @constructor
 */
function NoReadingsBox() {
    return (
        <div className="no-readings-box">
            <div className="no-readings-message">No reserve readings were found for this section.</div>
        </div>
    );
}

export default NoReadingsBox;