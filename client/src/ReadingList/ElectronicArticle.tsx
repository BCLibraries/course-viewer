import * as React from 'react';
import FileIcon from '../img/file-text.svg';
import LinkToReading from './LinkToReading';
import {partInformation} from './MetadataDisplay';
import ReadingStatusMessage from "./ReadingStatusMessage";
import buildReadingClassNames from "./buildReadingClassNames";


function ElectronicArticle({reading}: { reading: any }) {
    const thumbnail = <img src={FileIcon} className="thumbnail" alt={reading.metadata.article_title}/>;

    return (
        <li className={buildReadingClassNames('physical-article', reading.status)}>
            <LinkToReading mms={reading.metadata.mms_id} title={thumbnail} status={reading.status}/>
            <div className="item-reading.metadata">
                <div className={"cite-title"}>
                    <cite>
                        <LinkToReading mms={reading.metadata.mms_id} title={reading.metadata.article_title} status={reading.status}/>
                    </cite>
                </div>
                <div className={"cite-author"}>{reading.metadata.author}</div>
                <div className={"cite-journal-title"}>
                    {reading.metadata.journal_title}
                    <span className={"cite-journal-part"}> {partInformation(reading.metadata)}</span>
                </div>
                <div className={"date"}>{dateString(reading.metadata)}</div>
                <ReadingStatusMessage status={reading.status}/>
            </div>
        </li>
    )
}

function dateString(metadata: any) : string {
    // Just return empty string for now.
    return "";
}

export default ElectronicArticle;
