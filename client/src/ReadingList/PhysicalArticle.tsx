import * as React from 'react';
import PDFIcon from '../img/file-pdf.svg';
import LinkToReading from './LinkToReading';
import {partInformation, publisherInformation} from './MetadataDisplay';
import ReadingStatusMessage from "./ReadingStatusMessage";
import buildReadingClassNames from "./buildReadingClassNames";

function PhysicalArticle({reading}: { reading: any }) {
    const title = buildTitle(reading.metadata);
    const thumbnail = <img src={PDFIcon} className="thumbnail" alt={title}/>;

    return (
        <li className={buildReadingClassNames('physical-article', reading.status)}>
            <LinkToReading mms={reading.metadata.mms_id} title={thumbnail} status={reading.metadata.status}/>
            <div className="item-metadata">
                <div className={"cite-title"}>
                    <cite><LinkToReading mms={reading.metadata.mms_id} title={title} status={reading.metadata.status}/></cite>
                </div>
                <div className={"cite-author"}>{reading.metadata.author}</div>
                <div className={"cite-journal-title"}>
                    {reading.metadata.journal_title}
                    <span className={"cite-journal-part"}> {partInformation(reading.metadata)}</span>
                </div>
                {publisherInformation(reading.metadata)}
                <ReadingStatusMessage status={reading.status}/>
            </div>
        </li>
    )
}

/**
 * Get title
 *
 * Physical article titles are usually entered in article_title. Fallback to journal_title rather than
 * display no title.
 *
 * @param metadata
 */
function buildTitle(metadata: any) {
    return metadata.article_title ? metadata.article_title : metadata.journal_title;
}

export default PhysicalArticle;
