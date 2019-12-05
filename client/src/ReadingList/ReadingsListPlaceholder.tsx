import React from "react";
import ReadingPlaceholder from "./ReadingPlaceholder";

/**
 * Display in place of readings list when loading
 *
 * @constructor
 */
function ReadingsListPlaceholder() {
    return (
        <ul className="is-loading">
            <ReadingPlaceholder/>
            <ReadingPlaceholder/>
            <ReadingPlaceholder/>
            <ReadingPlaceholder/>
            <ReadingPlaceholder/>
        </ul>
    );
}

export default ReadingsListPlaceholder;