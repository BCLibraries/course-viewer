import * as React from 'react';
import PDFIcon from './img/file-pdf.svg';
import LinkToReading from './LinkToReading';

const thumbnail = <img src={PDFIcon} className="thumbnail" alt=""/>;

class PhysicalArticle extends React.Component<{ reading: any }, {}> {
    private static publisherInformation(metadata: any): JSX.Element | null {
        if (metadata.publisher && metadata.place_of_publication) {
            const place = metadata.place_of_publication.replace(/ *:/, '');
            return (
                <div className="{cite-publisher}">{place}: {metadata.publisher}</div>
            );
        }
        return null;
    }

    public render() {
        const metadata = this.props.reading.metadata;
        const publisherInfo = PhysicalArticle.publisherInformation(metadata);

        const title = metadata.article_title ? metadata.article_title : metadata.journal_title;

        return (
            <li className="physical-article">
                <LinkToReading mms={metadata.mms_id} title={thumbnail}/>
                <div className="item-metadata">
                    <div className={"cite-title"}><cite><LinkToReading mms={metadata.mms_id} title={title}/></cite>
                    </div>
                    <div className={"cite-author"}>{metadata.author}</div>
                    <div className={"cite-journal-title"}>{metadata.journal_title}</div>
                    {publisherInfo}
                </div>
            </li>
        )
    }
}

export default PhysicalArticle;
