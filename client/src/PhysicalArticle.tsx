import * as React from 'react';
import PDFIcon from './img/file-pdf.svg';
import LinkToReading from './LinkToReading';

const thumbnail = <img src={PDFIcon} className="thumbnail" alt=""/>;

const startsWithNumber = new RegExp(/^\d/);

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

        let partInfo = '';

        if (metadata.chapter) {
            if (startsWithNumber.test(metadata.chapter)) {
                metadata.chapter = `ch. ${metadata.chapter}`;
            }
        }

        if (metadata.pages) {
            if (startsWithNumber.test(metadata.pages)) {
                metadata.pages = `p. ${metadata.pages}`;
            }
        }

        if (metadata.chapter && metadata.pages) {
            partInfo = `${metadata.chapter}, ${metadata.pages}`;
        } else if (metadata.chapter) {
            partInfo = `${metadata.chapter}`;
        } else if (metadata.pages) {
            partInfo = `${metadata.pages}`;
        }

        return (
            <li className="physical-article">
                <LinkToReading mms={metadata.mms_id} title={thumbnail}/>
                <div className="item-metadata">
                    <div className={"cite-title"}><cite><LinkToReading mms={metadata.mms_id} title={title}/></cite>
                    </div>
                    <div className={"cite-author"}>{metadata.author}</div>
                    <div className={"cite-journal-title"}>{metadata.journal_title}{partInfo ? (
                        <span>, {partInfo}</span>) : (<span/>)}
                    </div>
                    {publisherInfo}
                </div>
            </li>
        )
    }
}

export default PhysicalArticle;
