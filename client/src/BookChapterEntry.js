import React, {Component} from 'react';

class BookChapterEntry extends Component {
    render() {
        return (
            <li>
                <img src={thumbnailURL(this.props.reading.metadata.isbn)}/>
                {this.props.reading.metadata.article_title}
            </li>
        )
    }
}

function thumbnailURL(isbn) {
    return `https://proxy-na.hosted.exlibrisgroup.com/exl_rewrite/syndetics.com/index.aspx?isbn=${isbn}/MC.JPG&client=primo`;

}

export default BookChapterEntry;
