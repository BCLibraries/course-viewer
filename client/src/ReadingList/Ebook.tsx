import * as React from 'react';
import LinkToReading from './LinkToReading';
import {creatorsLine, thumbnail} from "./MetadataDisplay";
import ReadingStatusMessage from "./ReadingStatusMessage";
import buildReadingClassNames from "./buildReadingClassNames";

function EBook({reading}: { reading: any }) {
    return (
        <li className={buildReadingClassNames('physical-book', reading.status)}>
            <LinkToReading mms={reading.metadata.mms_id} title={thumbnail(reading.metadata.isbn, reading.metadata.title)} status={reading.metadata.status}/>
            <cite><LinkToReading mms={reading.metadata.mms_id} title={reading.metadata.title} status={reading.metadata.status}/></cite><br/>
            {creatorsLine(reading.metadata)}<br/>
            {reading.metadata.publisher} {reading.metadata.year} {reading.metadata.edition}
            <ReadingStatusMessage status={reading.status}/>
        </li>
    )
}

export default EBook;
