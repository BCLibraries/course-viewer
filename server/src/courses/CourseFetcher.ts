import cache from "../Cache";
import fetchAvailability from './AvailabilityClient';
import fetchFromAlma from './AlmaClient';
import Citation from "./Citation";
import Course from './Course';
import ReadingList from './ReadingList';

import logger from '../Logger';

const activeListStatuses: any = ['complete', 'beingprepared', 'being prepared'];

async function fetchReadings(course: Course) {

    // Load any reading lists.
    const readingList = await fetchReadingList(course);
    if (!readingList) {
        return course;
    }

    // Load availability information for physical books.
    try {
        const physicalBooks = readingList.citations.filter(isPhysicalItem);
        const mmsIds = physicalBooks.map((cite: any) => cite.metadata.mms_id);

        if (mmsIds.length > 0) {
            const availabilityResults = await fetchAvailability(mmsIds);

            const availabilityData = availabilityResults.data;

            physicalBooks.forEach((book: Citation) => {
                const itemAvail = availabilityData[book.metadata.mms_id];

                if (itemAvail[0]) {
                    book.setAvailability(itemAvail, readingList.processDept);
                }
            });
        }
    } catch (e) {
        logger.error({e});
        // Don't fail if availability information isn't available, just return the list.
    }

    return readingList;
}

async function fetchReadingList(course: Course) {
    let readingList = await cache.fetchReadingList(course);

    // If list wasn't cached, fetch it.
    if (!readingList) {
        const courseFetchResponse = await fetchFromAlma('/courses/' + course.id, {});

        if (courseFetchResponse.data.reading_lists.reading_list) {
            const filteredLists = courseFetchResponse.data.reading_lists.reading_list.filter(listIsActive);
            if (filteredLists[0]) {
                readingList = filteredLists[0];
                readingList.processing_department = courseFetchResponse.data.processing_department.value;
                cache.saveReadingList(course, readingList);
            }
        }
    }
    return new ReadingList(readingList, readingList.processing_department);
}

function isPhysicalItem(cite: Citation) {
    const isPhysical = cite.type.primary === 'Physical Book' && !cite.metadata.title.includes('streaming');
    return isPhysical && !isEBook(cite);
}

function isEBook(cite: Citation) {
    const typeIsEbook = cite.type.primary === 'Physical Book' && cite.type.secondary === 'E-book';
    const hasEbookInTitle = cite.metadata.title.match(/\([eE]-?book/);
    return typeIsEbook || hasEbookInTitle;
}

function listIsActive(list: any) {
    return activeListStatuses.includes(list.status.value.toLowerCase());
}

export default fetchReadings;