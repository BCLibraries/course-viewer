import * as React from 'react';
import LinkToReading from "./LinkToReading";

class Book extends React.Component<{ reading: any }, {}> {
    public render() {
        const reading = this.props.reading;
        const metadata = reading.metadata;
        const availabilityInfo = reading.availability ? buildAvailabilityLine(reading.availability[0]) : '';
        let displayTitle = metadata.title;
        let thumbnail = <img src={thumbnailURL(metadata.isbn)} className="thumbnail" alt=""/>;

        if (!reading.availability) {
            displayTitle = <LinkToReading mms={metadata.mms_id} title={metadata.title}/>;
            thumbnail = <LinkToReading mms={metadata.mms_id} title={thumbnail}/>
        }

        const additionalPerson = (metadata.additional_person_name) ? `; ${metadata.additional_person_name}` : '';

        return (
            <li className="physical-book">
                {thumbnail}
                <div className="item-metadata">
                    <div><cite>{displayTitle}</cite></div>
                    <div>{metadata.author}{additionalPerson}</div>
                    <div>{metadata.publisher} {metadata.year} {metadata.edition}</div>
                    <div>{availabilityInfo}</div>
                </div>
            </li>
        )
    }
}

function thumbnailURL(isbn: any) {
    return `https://proxy-na.hosted.exlibrisgroup.com/exl_rewrite/syndetics.com/index.aspx?isbn=${isbn}/MC.JPG&client=primo`;
}

function buildAvailabilityLine(availability: any) {
    if (availability.availability === 'available') {
        return (
            <div className="availability">
                <strong>Available</strong> at {availability.library} {availability.location}</div>
        );
    } else if (availability.availability === 'unavailable') {
        return (
            <div className="availability">
                <strong>Unavailable</strong></div>
        );
    }
    return null;
}

export default Book;
