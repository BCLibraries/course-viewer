import cache from "../Cache";
import fetchAvailability from './AvailabilityClient';
import fetchFromAlma from './AlmaClient';
import Citation from "./Citation";
import Course from './Course';
import ReadingList from './ReadingList';

import logger from '../Logger';

const activeListStatuses: any = ['complete', 'beingprepared', 'being prepared'];

/**
 * Fetch readings for a course
 *
 * @param course
 */
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

    // First look for a cached reading list. Reading lists are cached as the reified object taken from the
    // API JSON response.
    let readingListJSON = await cache.fetchReadingList(course);

    // If list wasn't cached, fetch it.
    if (!readingListJSON) {

        // Query the Alma course API.
        const courseFetchResponse = await fetchFromAlma('/courses/' + course.id, {});

        // Check if the course has any reading lists.
        if (courseFetchResponse.data.reading_lists.reading_list) {

            // Use the first active reading list.
            const filteredLists = courseFetchResponse.data.reading_lists.reading_list.filter(listIsActive);
            if (filteredLists[0]) {
                readingListJSON = filteredLists[0];
                readingListJSON.processing_department = courseFetchResponse.data.processing_department.value;
                cache.saveReadingList(course, readingListJSON);
            }
        }
    }
    return new ReadingList(readingListJSON, readingListJSON.processing_department);
}

/**
 * Is this a physical item?
 *
 * @param cite
 */
function isPhysicalItem(cite: Citation) {

    // eBooks are sometimes typed as physical books in reserves, as are streaming videos. Only
    // call a book a physical book if it is neither one of those things.
    const isPhysical = cite.type.primary === 'Physical Book' && !cite.metadata.title.includes('streaming');
    return isPhysical && !isEBook(cite);
}

/**
 * Is this an eBook?
 *
 * @param cite
 */
function isEBook(cite: Citation) {

    // It's an eBook if it says "eBook", even if it's typed as a physical book.
    const typeIsEbook = cite.type.primary === 'Physical Book' && cite.type.secondary === 'E-book';
    const hasEbookInTitle = cite.metadata.title.match(/\([eE]-?book/);
    return typeIsEbook || hasEbookInTitle;
}

function listIsActive(list: any) {
    return activeListStatuses.includes(list.status.value.toLowerCase());
}

export default fetchReadings;