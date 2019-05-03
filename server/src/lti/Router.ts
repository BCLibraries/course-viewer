import {Request, Response} from "express";
import validate from './LTIValidator';
import logger from '../Logger';

const router = require('express').Router();

router.post('/', launch);


router.get('/config.xml', sendConfig);
router.get('/config', sendConfig);

function sendConfig(req: Request, res: Response) {
    const launchUrl = `https://${req.get('host')}${process.env.API_URL_ROOT}${req.baseUrl}`;
    res.set('Content-Type', 'application/rss+xml');
    res.render('config.xml.pug', {launchUrl});
}

function launch(req: Request, res: Response) {
    if (!validate(req)) {
        res.send({status: false});
    }

    const regExp = /([A-Z]{4}\d{4})(X\w|\d\d)\d{4}[SFU]/;
    let courseId = '';
    let sectionId = 'X';
    if (req.body.lis_course_offering_sourcedid) {
        const match = req.body.lis_course_offering_sourcedid.match(regExp);
        if (match) {
            courseId = match[1];
            sectionId = match[2];
        } else {
            courseId = req.body.lis_course_offering_sourcedid;
        }
    } else {
        courseId = req.body.context_label;
    }
    const url = `https://library.bc.edu/courses/${courseId}/section/${sectionId}`;
    logger.info({type: 'lti-launch-request', body: req.body, courseId: courseId, sectionId: sectionId, url: url});
    res.redirect(303, url);
}

export default router;