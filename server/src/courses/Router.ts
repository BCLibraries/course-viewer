import {Request, Response} from "express";
import fetchGuides from "./LibGuidesClient";
import fetchSubject from "./SubjectLookup";
import searchForCourse from "./CourseSearcher";
import fetchReadings from "./CourseFetcher";

const router = require('express').Router();

require('events').EventEmitter.defaultMaxListeners = 15;

async function getCourseByCodeAndSection(req: Request, res: Response) {
    const fetchPromises = [];

    const code = req.params.course_code ? req.params.course_code : req.params.searchable_id;
    const section = req.params.section_id ? req.params.section_id : '';
    const codeParts = code.match(/([a-zA-Z]+)(\d+)/);
    const subject = (codeParts && codeParts[1]) ? codeParts[1] : '';

    const course = await searchForCourse(code, section);

    const subjects: string[] = (code === 'HIST1511' || code === 'BIOL1503') ? ['HIST', 'BIOL'] : [subject];

    fetchPromises.push(fetchSubject(subjects));

    // Send request for LibGuides.
    fetchPromises.push(fetchGuides(code, section));

    // If the course is active, fetch it.
    if (course.isActive) {
        fetchPromises.push(fetchReadings(course));
    }

    res.setHeader('Content-Type', 'application/json');

    // When we have received responses from all data sources, send response.
    Promise.all(fetchPromises)
        .then((response: any[]) => {
            // Add subject info to course;
            if (response[0]) {
                const subjectResponse = (response[0] && response[0][1]) ? response[0][0] : response[0];
                if (subjectResponse[0] !== null) {
                    console.log(subjectResponse);
                    course.subject_info = JSON.parse(subjectResponse);
                }
            }

            // Add guides to course
            course.research_guides = response[1];

            // Add reading list to course.
            if (response[2]) {
                course.addList(response[2])
            }

            res.send(JSON.stringify(course));
        }).catch((error: any) => {
        /* tslint:disable */
        console.log(error);
        res.send(JSON.stringify({message: error.message}));
    });
}

router.get('/:course_code/sections/:section_id', getCourseByCodeAndSection);

export default router;