import React from "react";

/**
 * Display in place of a reading when loading
 *
 * @constructor
 */
function ReadingPlaceholder(): any {
    return (
        <li className="physical-book ph-item">
            <div className="thumbnail"/>
            <div className="book-ph-line"/>
            <div className="book-ph-line"/>
            <div className="book-ph-line"/>
        </li>
    );
}

export default ReadingPlaceholder;