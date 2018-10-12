import * as React from 'react';
import LinkToReading from './LinkToReading';

class EBook extends React.Component<{ reading: any }, {}> {
    public render() {
        const metadata = this.props.reading.metadata;
        const thumbnail = <img src={thumbnailURL(metadata.isbn)} className="thumbnail" alt=""/>;

        return (
            <li className="physical-book">
                <LinkToReading mms={metadata.mms_id} title={thumbnail}/>
                <cite><LinkToReading mms={metadata.mms_id} title={metadata.title}/></cite><br/>
                {this.creatorsLine(metadata)}<br/>
                {metadata.publisher} {metadata.year} {metadata.edition}
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

export default EBook;
