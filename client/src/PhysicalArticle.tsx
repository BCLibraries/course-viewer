import * as React from 'react';
import PDFIcon from './img/file-pdf.svg';
import LinkToReading from './LinkToReading';
import {partInformation, publisherInformation} from './MetadataDisplay';

function PhysicalArticle({reading}: { reading: any }) {
    const title = buildTitle(reading.metadata);
    const thumbnail = <img src={PDFIcon} className="thumbnail" alt={title}/>;

    return (
        <li className="physical-article">
            <LinkToReading mms={reading.metadata.mms_id} title={thumbnail}/>
            <div className="item-metadata">
                <div className={"cite-title"}>
                    <cite><LinkToReading mms={reading.metadata.mms_id} title={title}/></cite>
                </div>
                <div className={"cite-author"}>{reading.metadata.author}</div>
                <div className={"cite-journal-title"}>
                    {reading.metadata.journal_title}
                    <span className={"cite-journal-part"}> {partInformation(reading.metadata)}</span>
                </div>
                {publisherInformation(reading.metadata)}
            </div>
        </li>
    )
}

function buildTitle(metadata: any) {
    return metadata.article_title ? metadata.article_title : metadata.journal_title;
}

export default PhysicalArticle;
