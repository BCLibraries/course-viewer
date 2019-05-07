import * as React from 'react';
import LinkToReading from "./LinkToReading";
import {creatorsLine, thumbnail} from "./MetadataDisplay";

function Book({reading}: { reading: any }) {
    return (
        <li className={typeClass(reading.type)}>
            {buildThumbnail(reading)}
            <div className="item-metadata">
                <div><cite>{buildDisplayTitle(reading)}</cite></div>
                <div>{creatorsLine(reading.metadata)}</div>
                <div>{reading.metadata.publisher} {reading.metadata.year} {reading.metadata.edition}</div>
                <div>{availabilityInfo(reading)}</div>
            </div>
        </li>
    )
}

function typeClass(type: any): string {
    return type.secondary && type.secondary === 'Video' ? 'physical-video' : 'physical-book'
}

function buildDisplayTitle(reading: any) {
    const displayTitle = reading.metadata.title;
    return reading.availability ? displayTitle : <LinkToReading mms={reading.metadata.mms_id} title={displayTitle}/>;
}

function buildThumbnail(reading: any) {
    const thumb = thumbnail(reading.metadata.isbn);
    return reading.availability ? thumb : <LinkToReading mms={reading.metadata.mms_id} title={thumb}/>;
}

function availabilityInfo(reading: any) {
    if (!reading.availability) {
        return '';
    }

    const availability = reading.availability[0];

    switch (availability.availability) {
        case 'available': {
            return available(availability);
        }
        case 'unavailable': {
            return checkedOut(availability);
        }
        default: {
            return checkForAvailability(reading.metadata);
        }
    }
}

function available(availability: any) {
    return (
        <div className="availability">
            {availability.library} {availability.location}<br/>
            {availability.call_number}
        </div>
    )
}

function checkedOut(availability: any) {
    return (
        <div className="availability checked-out">
            <strong>Currently checked out</strong><br/>
            {availability.library} {availability.location}<br/>
            {availability.call_number}
        </div>
    );
}

function checkForAvailability(metadata:any) {
    return (
        <div className="availability">
            <strong><LinkToReading mms={metadata.mms_id} title={'Check record in catalog for availability'}/></strong>
        </div>
    )
}

export default Book;
