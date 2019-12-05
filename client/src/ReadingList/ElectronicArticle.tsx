import * as React from 'react';
import FileIcon from '../img/file-text.svg';
import LinkToReading from './LinkToReading';
import {partInformation} from './MetadataDisplay';


function ElectronicArticle({reading}: { reading: any }) {
    const thumbnail = <img src={FileIcon} className="thumbnail" alt={reading.metadata.article_title}/>;

    return (
        <li className="physical-article">
            <LinkToReading mms={reading.metadata.mms_id} title={thumbnail}/>
            <div className="item-reading.metadata">
                <div className={"cite-title"}>
                    <cite>
                        <LinkToReading mms={reading.metadata.mms_id} title={reading.metadata.article_title}/>
                    </cite>
                </div>
                <div className={"cite-author"}>{reading.metadata.author}</div>
                <div className={"cite-journal-title"}>
                    {reading.metadata.journal_title}
                    <span className={"cite-journal-part"}> {partInformation(reading.metadata)}</span>
                </div>
                <div className={"date"}>{dateString(reading.metadata)}</div>
            </div>
        </li>
    )
}

function dateString(metadata: any) : string {
    return "";
}

export default ElectronicArticle;
