import {Request, Response} from "express";
import lookup from "./SubjectLookup";

let router = require('express').Router();
let {fetchCourse} = require('./AlmaClient');

require('events').EventEmitter.defaultMaxListeners = 15;


async function getCourse(req: Request, res: Response) {
    let outgoing = null;
    const course_id = req.params.course_id;
    const section_id = req.params.section_id;

    const subject = await lookup(course_id.substring(0,4));

    fetchCourse(course_id, section_id)
        .then((response: any) => {
            outgoing = response;
            outgoing.subject_info = JSON.parse(subject);
            res.setHeader('Content-Type', 'application/json');
            // res.setHeader('Cache-Control','max-age=120');
            res.send(JSON.stringify(outgoing));
        }).catch((error: any) => {
            outgoing = {message: error.message};
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(outgoing));
    });
} 

router.get('/:course_id/sections/:section_id', getCourse);

export default router;