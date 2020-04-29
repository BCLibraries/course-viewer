import * as React from 'react';

type LinkToReadingProps = {
    mms: string,    // The reading's MMS
    title: any,  // Function to render the page header
    status: string  // Is the reading ready or being prepared?
}

/**
 * Post link to reading if available
 *
 * @param mms
 * @param title
 * @param status
 * @constructor
 */
function LinkToReading({mms, title, status}: LinkToReadingProps) {
    return (status === 'Complete') ? completeReadingLink(mms, title) : beingPreparedMessage(title);
}

/**
 * Link to reading
 *
 * @param mms
 * @param title
 */
function completeReadingLink(mms:string, title:any) {
    const url = `${process.env.REACT_APP_API_BASE}/items/${mms}`;
    return <a href={url} target={'_blank'}>{title}</a>;
}

/**
 * Reading is not ready
 */
function beingPreparedMessage(title:any) {
    return <span className="being-prepared-indicator">{title}</span>;
}

export default LinkToReading;