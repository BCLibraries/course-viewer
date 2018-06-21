import * as React from 'react';
import Book from './Book';
import EBook from './Ebook';
import ElectronicArticle from './ElectronicArticle';
import PhysicalArticle from './PhysicalArticle';

function readingFactory(reading: any) {
    switch (reading.type.primary) {
        case 'Physical Article':
            return (<PhysicalArticle key={reading.id} reading={reading}/>);
        case 'Electronic Article':
            return (<ElectronicArticle key={reading.id} reading={reading}/>);
        case 'E-book':
            return (<EBook key={reading.id} reading={reading}/>);
        default:
            return (<Book key={reading.id} reading={reading}/>);
    }
}

class ReadingList extends React.Component<{ readings: any }, {}> {
    public render() {
        const readingList = this.props.readings.map(readingFactory);
        return  (<ul>{readingList}</ul>);
    }
}

export default ReadingList;