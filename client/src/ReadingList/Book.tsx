import * as React from 'react';
import LinkToReading from "./LinkToReading";
import {creatorsLine, thumbnail} from "./MetadataDisplay";
import ReadingStatusMessage from "./ReadingStatusMessage";
import buildReadingClassNames from "./buildReadingClassNames";

export interface Availability {
    availability: string;
    call_number: string;
    library: string;
    location: string;
}


function Book({reading}: { reading: any }) {

    // Hide books that can't be loaned.
    if (reading.availability && reading.availability[0] && reading.availability[0].location.includes('No Loan')) {
        return <span></span>;
    }

    const readingClass = getReadingClass(reading.type);

    return (
        <li className={buildReadingClassNames(readingClass, reading.status)}>
            {buildThumbnail(reading)}
            <div className="item-metadata">
                <div><cite>{buildDisplayTitle(reading)}</cite></div>
                <div>{creatorsLine(reading.metadata)}</div>
                <div>{reading.metadata.publisher} {reading.metadata.year} {reading.metadata.edition}</div>
                <div>{availabilityInfo(reading)}</div>
                <ReadingStatusMessage status={reading.status}/>
            </div>
        </li>
    )
}

/**
 * What className do we give based on type?
 *
 * @param type
 */
function getReadingClass(type: any): string {
    return type.secondary && type.secondary === 'Video' ? 'physical-video' : 'physical-book';
}

/**
 * Get display title
 *
 * Titles for electronic books should be clickable links. Titles for physical books are just
 * text.
 *
 * @param reading
 */
function buildDisplayTitle(reading: any) {
    const displayTitle = reading.metadata.title;
    return reading.availability ? displayTitle :
        <LinkToReading mms={reading.metadata.mms_id} title={displayTitle} status={reading.status}/>;
}

/**
 * Get thumbnail
 *
 * Adds links for electronic books/videos.
 *
 * @param reading
 */
function buildThumbnail(reading: any) {
    const thumb = thumbnail(reading.metadata.isbn, reading.metadata.title);
    return reading.availability ? thumb :
        <LinkToReading mms={reading.metadata.mms_id} title={thumb} status={reading.status}/>;
}

/**
 * Availability status
 *
 * @param reading
 */
function availabilityInfo(reading: any) {

    // For electronic readings, display nothing.
    if (!reading.availability) {
        return '';
    }

    const availability = getBestAvailability(reading.availability);

    switch (availability.availability) {
        case 'available': {
            return available(availability);
        }
        case 'unavailable': {
            return checkedOut(availability);
        }
        default: {
            return checkForAvailability(reading.metadata, reading.status);
        }
    }
}

/**
 * Determine best availability
 *
 * If there is a reading at a reserves desk that is available, choose that one. Otherwise return the first
 * availability.
 *
 * @param availabilities
 */
function getBestAvailability(availabilities: Availability[]) {

    const reservesAvailability = availabilities.find(isInReserves);

    if (reservesAvailability) {
        return reservesAvailability;
    }

    return availabilities[0];
}

function isInReserves(availability: Availability) {
    return availability.location.includes('Reserves');
}

/**
 * Item on shelf availability status message
 *
 * @param availability
 */
function available(availability: any) {
    return (
        <div className="availability">
            {availability.library} {availability.location}<br/>
            {availability.call_number}
        </div>
    )
}

/**
 * Item not on shelf status message
 *
 * @param availability
 */
function checkedOut(availability: any) {
    return (
        <div className="availability checked-out">
            <strong>Currently checked out</strong><br/>
            {availability.library} {availability.location}<br/>
            {availability.call_number}
        </div>
    );
}

/**
 * Link to Primo for unknown availability status
 *
 * @param metadata
 * @param status
 */
function checkForAvailability(metadata: any, status: any) {
    return (
        <div className="availability">
            <strong><LinkToReading mms={metadata.mms_id} title={'Check record in catalog for availability'}
                                   status={status}/></strong>
        </div>
    )
}

export default Book;
