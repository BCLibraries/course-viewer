import * as React from 'react';
import FileIcon from './img/file-text.svg';
import LinkToReading from './LinkToReading';

class ElectronicArticle extends React.Component<{ reading: any }, {}> {
    public render() {
        const metadata = this.props.reading.metadata;
        const dateString = this.dateString(metadata);
        const thumbnail = <img src={FileIcon} className="thumbnail" alt=""/>;

        return (
            <li className="physical-article">
                <LinkToReading mms={metadata.mms_id} title={thumbnail}/>
                <div className="item-metadata">
                    <div className={"cite-title"}>
                        <cite><LinkToReading mms={metadata.mms_id} title={metadata.article_title}/></cite></div>
                    <div className={"cite-author"}>{metadata.author}</div>
                    <div className={"cite-journal-title"}>{metadata.journal_title}</div>
                    <div className={"date"}>{dateString}</div>
                </div>
            </li>
        )
    }

    private dateString(metadata: any) {
        return "";
    }
}

export default ElectronicArticle;
