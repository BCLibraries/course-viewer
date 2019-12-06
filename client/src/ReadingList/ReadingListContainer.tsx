import React from "react";
import PhysicalArticle from "./PhysicalArticle";
import ElectronicArticle from "./ElectronicArticle";
import EBook from "./Ebook";
import Book from "./Book";
import ReadingList from "./ReadingList";
import NoReadingsBox from "./NoReadingsBox";

type ReadingListContainerProps = {
    readings: any[] // An array of reading objects fetched from the API
}

/**
 * Logic for displaying a list of course readings
 *
 * @param readings
 * @constructor
 */
function ReadingListContainer({readings}: ReadingListContainerProps) {
    // If the reading list is empty, show an empty reading list box.
    if (readings.length === 0) {
        return (
            <NoReadingsBox/>
        );
    }

    return (
        <ReadingList>
            {readings.map(readingFactory).sort(compareReadingsByTitle)}
        </ReadingList>
    );
}

/**
 * Determine the correct display type for each reading object
 *
 * @param reading
 */
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

/**
 * Compare two readings for alphabetical sorting by title
 *
 * @param a
 * @param b
 */
function compareReadingsByTitle(a: any, b: any) {
    if (a.props.reading.sortTitle < b.props.reading.sortTitle) {
        return -1;
    }
    if (a.props.reading.sortTitle > b.props.reading.sortTitle) {
        return 1;
    }
    return 0;
}

export default ReadingListContainer;