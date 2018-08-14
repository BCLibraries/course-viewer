import {Request, Response} from "express";

let router = require('express').Router();
const axios = require('axios');
const OpenURL = require('./OpenURL');

function redirectToItem(req: Request, res: Response) {
    const params = {
        svc_dat: 'CTO',
        debug: true,
        'rft.mms_id': req.params.mms_id
    };

    axios.get(process.env.OPENURL_BASE, {params})
        .then((response: any) => {
            let openurl = new OpenURL(response.data);
            res.redirect(302, openurl.targetLink);
        });
}

router.get('/:mms_id', redirectToItem);

export default router;