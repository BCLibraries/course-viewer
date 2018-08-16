import {Request, Response} from "express";

let router = require('express').Router();
const axios = require('axios');
const OpenURL = require('./OpenURL');

const linkToPrimoBase = 'http://bclib.bc.edu/libsearch/bc/keyword';

function redirectToItem(req: Request, res: Response) {
    const fallbackItemUrl = `${linkToPrimoBase}/${req.params.mms_id}`;
    const params = {
        svc_dat: 'CTO',
        debug: true,
        'rft.mms_id': req.params.mms_id
    };

    axios.get(process.env.OPENURL_BASE, {params})
        .then((response: any) => {
            let openurl = new OpenURL(response.data);
            const itemUrl = openurl.targetLink ? openurl.targetLink : fallbackItemUrl;
            res.redirect(302, itemUrl);
        });
}

router.get('/:mms_id', redirectToItem);

export default router;