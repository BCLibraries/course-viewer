import React from 'react';

type ReadingListProps = {
    children: any[] // Each child is a single reading element (e.g. <Book/>, <EBook/>, etc)
}

/**
 * Display a reading list
 *
 * @param children
 * @constructor
 */
function ReadingList({children}: ReadingListProps) {
    return (
        <ul>
            {children}
        </ul>
    );
}

export default ReadingList;