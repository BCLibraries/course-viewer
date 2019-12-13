import {Request, Response} from "express";
import fetchGuides from "./LibGuidesClient";
import fetchSubject from "./SubjectLookup";
import searchForCourse from "./CourseSearcher";
import fetchReadings from "./CourseFetcher";

const router = require('express').Router();

// Increase number of maximum event listeners. We have enough RAM, and more
// listeners prevents waiting.
require('events').EventEmitter.defaultMaxListeners = 15;

async function getCourseByCodeAndSection(req: Request, res: Response) {

    // List of promises for data that we will fetch.
    const fetchPromises = [];

    // Parse information about the course out of the request.
    const code = req.params.course_code ? req.params.course_code : req.params.searchable_id;
    const section = req.params.section_id ? req.params.section_id : '';
    const codeParts = code.match(/([a-zA-Z]+)(\d+)/);
    const subject = codeParts && codeParts[1] ? codeParts[1] : '';

    const course = await searchForCourse(code, section);

    let subjects: string[] = [subject];

    // Set subjects for special case courses where the course code does not
    // reflect the subject.
    // TODO: Add special cases as an ENV value so that they don't require changing code
    if (code === 'HIST1511' || code === 'BIOL1503') {
        subjects = ['HIST', 'BIOL'];
    } else if (code === 'ENGL1010') {
        subjects = ['FWS'];
    } else if (code === 'HIST1513' || code === 'EESC1507') {
        subjects = ['EES1']
    } else if (code === 'EDUC7308') {
        subjects = ['ERME']
    }

    // Add the subject lookup to data to fetch.
    fetchPromises.push(fetchSubject(subjects));

    // Send request for LibGuides.
    fetchPromises.push(fetchGuides(code, section));

    // If the course is active, fetch its readings.
    if (course.isActive) {
        fetchPromises.push(fetchReadings(course));
    }

    res.setHeader('Content-Type', 'application/json');

    // When we have received responses from all data sources, send response.
    Promise.all(fetchPromises)

        // Success! Promise.all() returns an array of responses, one per each promise
        // in the original array, in the order in which they were submitted:
        //
        //   * response[0]: subject librarian/FAQ lookup response
        //   * response[1]: LibGuides lookup
        //   * response[2]: readings lookup (optional)
        .then((response: any[]) => {

            // Add subject info to course. Subject librarian and FAQ data is hidden deep
            // in the JSON response.
            if (response[0]) {
                const subjectResponse = response[0][1] ? response[0][0] : response[0];
                if (subjectResponse[0] !== null) {
                    course.subject_info = JSON.parse(subjectResponse);
                }
            }

            // Add guides to course
            course.research_guides = response[1];

            // Add reading list to course.
            if (response[2]) {
                course.addList(response[2])
            }

            // Respond.
            res.send(JSON.stringify(course));

        })

        // If any request failed, send an error response and log.
        // TODO: add separate error states for different request failures
        .catch((error: any) => {
            /* tslint:disable */
            console.log(error);
            res.send(JSON.stringify({message: error.message}));
        });
}

router.get('/:course_code/sections/:section_id', getCourseByCodeAndSection);

export default router;