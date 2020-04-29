import React from "react";

type ReadingStatusMessageProps = {
    status: string
}

/**
 * Display a message if reading is being prepared
 *
 * @param status
 * @constructor
 */
function ReadingStatusMessage({status}: ReadingStatusMessageProps) {
    if (status === 'Complete') {
        return <span className="reading-complete-span"/>
    }

    return <div className="being-prepared-message">Reading is being prepared.</div>;
}

export default ReadingStatusMessage;