import {Request, Response} from "express";
import validate from './LTIValidator';
import logger from '../Logger';

const router = require('express').Router();

// Route to launch LTI
router.post('/', launch);

/**
 * Launch the LTI
 *
 * @param req
 * @param res
 */
function launch(req: Request, res: Response) {

    // Validate that we have received a proper LTI request.
    if (!validate(req)) {
        res.send({status: false});
    }

    // Extract the course and section information from the LTI request.
    const regExp = /([A-Z]{4}\d{4})(X\w|\d\d)(\d{4})([SFU])/;
    let courseId = '';
    let sectionId = 'X';
    let year = 2000;
    let semester = 'F';

    // If there is no sourcedid, use the context label. This shouldn't happen often.
    if (!req.body.lis_course_offering_sourcedid) {
        courseId = req.body.context_label;
    }

    // Special case for test course
    else if (req.body.lis_course_offering_sourcedid === 'LIBS503X') {
        courseId = 'LIBS503X';
        sectionId = '01';
    }

    // Majority of cases, parse the sourcedid to figure out the course and section numbers.
    else {
        console.log(`matching against ${req.body.lis_course_offering_sourcedid}`);
        const match = req.body.lis_course_offering_sourcedid.match(regExp);
        if (match) {
            courseId = match[1];
            sectionId = match[2];
            year = match[3];
            semester = match[4];
        } else {

            // No match? The sourcedid is probably a whole searchable course ID.
            courseId = req.body.lis_course_offering_sourcedid;
        }
    }

    // Redirect to the appropriate course display page.
    const url = determineURL(courseId, sectionId, year, semester);
    logger.info({
        type: 'lti-launch-request',
        body: req.body,
        courseId: courseId,
        sectionId: sectionId,
        url: url,
        year: year,
        semester: semester
    });
    res.redirect(303, url);
}

// Routes for LTI configuration cartridge
router.get('/config.xml', sendConfig);
router.get('/config', sendConfig);

// Send the XML configuration cartridge.
function sendConfig(req: Request, res: Response) {
    const launchUrl = `https://${req.get('host')}${process.env.API_URL_ROOT}${req.baseUrl}`;
    res.set('Content-Type', 'application/rss+xml');
    res.render('config.xml.pug', {launchUrl});
}

function determineURL(courseId: string, sectionId: string, year: number, semester: string) {
    const base = 'https://library.bc.edu/courses';
    if (year < 2021) {
        return `${base}/expired`;
    }

    return `${base}/${courseId}/section/${sectionId}`;
}

export default router;