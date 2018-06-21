import {Request, Response} from "express";
import validate from './LTIValidator';

const router = require('express').Router();

router.post('/', launch);

router.get('/config.xml', sendConfig);
router.get('/config', sendConfig);

function sendConfig(req: Request, res: Response) {
    const launchUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    res.set('Content-Type', 'application/rss+xml');
    res.render('config.xml.pug', {launchUrl});
}

function launch(req: Request, res: Response) {
    if (! validate(req)) {
        res.send({status: false});
    }
    const match = req.body.lis_course_offering_sourcedid.match(/([A-Z]{4}\d{4})(\d{2})\d{4}[SFU]/);
    const url = `http://localhost:3000/course/${match[1]}/section/${match[2]}`;
    res.redirect(303, url);
}

export default router;