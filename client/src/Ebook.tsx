import * as React from 'react';
import LinkToReading from './LinkToReading';
import {creatorsLine, thumbnail} from "./MetadataDisplay";

function EBook({reading}: {reading:any}) {
    return (
        <li className="physical-book">
            <LinkToReading mms={reading.metadata.mms_id} title={thumbnail(reading.metadata.isbn)}/>
            <cite><LinkToReading mms={reading.metadata.mms_id} title={reading.metadata.title}/></cite><br/>
            {creatorsLine(reading.metadata)}<br/>
            {reading.metadata.publisher} {reading.metadata.year} {reading.metadata.edition}
        </li>
    )}

export default EBook;
