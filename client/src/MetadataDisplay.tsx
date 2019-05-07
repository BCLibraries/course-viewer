import * as React from "react";

const startsWithNumber = new RegExp(/^\d/);

export function publisherInformation(metadata: any): JSX.Element | null {
    if (metadata.publisher && metadata.place_of_publication) {
        const place = metadata.place_of_publication.replace(/ *:/, '');
        return (
            <div className="{cite-publisher}">{place}: {metadata.publisher}</div>
        );
    }
    return null;
}

export function partInformation(metadata: any) {
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
    return partInfo;
}

export function creatorsLine(metadata: any) {
    const creators = [];
    if (metadata.author) {
        creators.push(metadata.author);
    }
    if (metadata.additional_person_name) {
        creators.push(metadata.additional_person_name);
    }
    return creators.join('; ');
}

export function thumbnailURL(isbn: any) {
    return `https://proxy-na.hosted.exlibrisgroup.com/exl_rewrite/syndetics.com/index.aspx?isbn=${isbn}/MC.JPG&client=primo`;
}

export function thumbnail(isbn: any) {
    return <img src={thumbnailURL(isbn)} className="thumbnail" alt=""/>;
}