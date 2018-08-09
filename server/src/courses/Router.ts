import {Request, Response} from "express";
import Course from "./Course";
import fetchGuides from "./LibGuidesClient";
import lookup from "./SubjectLookup";

const router = require('express').Router();
const {fetchCourse} = require('./AlmaClient');

require('events').EventEmitter.defaultMaxListeners = 15;

async function getCourseByCodeAndSection(req: Request, res: Response) {
    let outgoing = null;
    const course = new Course();
    course.code = req.params.course_code ? req.params.course_code : req.params.searchable_id;
    course.number = req.params.course_code ? req.params.course_code.substring(8 - 4) : '';
    course.section = req.params.section_id ? req.params.section_id : '';
    course.department = req.params.section_id ? course.id.substring(0, 4) : '';
    const subjectInfo = await lookup(course.code.substring(0, 4));
    if (subjectInfo) {
        course.subject_info = JSON.parse(subjectInfo);
    }
    const guidePromise = fetchGuides(course);
    const almaPromise = fetchCourse(course);

    Promise.all([guidePromise, almaPromise])
        .then((response: any[]) => {
            outgoing = course;
            res.setHeader('Content-Type', 'application/json');
            // res.setHeader('Cache-Control','max-age=120');
            res.send(JSON.stringify(outgoing));
        }).catch((error: any) => {
        outgoing = {message: error.message};
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(outgoing));
    });
}

router.get('/:course_code/sections/:section_id', getCourseByCodeAndSection);

export default router;