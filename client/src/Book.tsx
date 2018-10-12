import * as React from 'react';
import LinkToReading from "./LinkToReading";

class Book extends React.Component<{ reading: any }, {}> {
    public render() {
        const reading = this.props.reading;
        const metadata = reading.metadata;
        const availabilityInfo = reading.availability ? buildAvailabilityLine(reading.availability[0], metadata) : '';
        let displayTitle = metadata.title;
        let thumbnail = <img src={thumbnailURL(metadata.isbn)} className="thumbnail" alt=""/>;

        if (!reading.availability) {
            displayTitle = <LinkToReading mms={metadata.mms_id} title={metadata.title}/>;
            thumbnail = <LinkToReading mms={metadata.mms_id} title={thumbnail}/>;
        }

        const typeClass = reading.type.secondary && reading.type.secondary === 'Video' ? 'physical-video' : 'physical-book';

        return (
            <li className={typeClass}>
                {thumbnail}
                <div className="item-metadata">
                    <div><cite>{displayTitle}</cite></div>
                    <div>{this.creatorsLine(metadata)}</div>
                    <div>{metadata.publisher} {metadata.year} {metadata.edition}</div>
                    <div>{availabilityInfo}</div>
                </div>
            </li>
        )
    }

    private creatorsLine(metadata: any) {
        const creators = [];
        if (metadata.author) {
            creators.push(metadata.author);
        }
        if (metadata.additional_person_name) {
            creators.push(metadata.additional_person_name);
        }
        return creators.join('; ');
    }
}

function thumbnailURL(isbn: any) {
    return `https://proxy-na.hosted.exlibrisgroup.com/exl_rewrite/syndetics.com/index.aspx?isbn=${isbn}/MC.JPG&client=primo`;
}

function buildAvailabilityLine(availability: any, metadata: any) {
    if (availability.availability === 'available') {
        return (
            <div className="availability">
                {availability.library} {availability.location}<br/>
                {availability.call_number}
            </div>
        );
    } else if (availability.availability === 'unavailable') {
        return (
            <div className="availability checked-out">
                <strong>Currently checked out</strong><br/>
                {availability.library} {availability.location}<br/>
                {availability.call_number}
            </div>
        );
    } else {
        return (
            <div className="availability">
                <strong><LinkToReading mms={metadata.mms_id} title={'Check record in catalog for availability'}/></strong>
            </div>
        )
    }
}

export default Book;
