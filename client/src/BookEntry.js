import React, {Component} from 'react';

class BookEntry extends Component {
    render() {
        return (
            <li>
                <img src={thumbnailURL(this.props.reading.metadata.isbn)} alt=""/>
                {this.props.reading.metadata.title}
            </li>
        )
    }
}

function thumbnailURL(isbn) {
    return `https://proxy-na.hosted.exlibrisgroup.com/exl_rewrite/syndetics.com/index.aspx?isbn=${isbn}/MC.JPG&client=primo`;

}

export default BookEntry;
