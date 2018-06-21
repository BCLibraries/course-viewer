import { Request, Response } from "express";
let router = require('express').Router();
const axios = require('axios');
const OpenURL = require('./OpenURL');

const openurl_base = 'http://bc.alma.exlibrisgroup.com/view/uresolver/01BC_INST/openurl',
    base_params = {
        svc_dat: 'CTO',
        debug: true
    };

function redirectToItem(req: Request, res:Response) {
    const local_params = {'rft.mms_id': req.params['mms_id']};

    axios.get(openurl_base, {params: {...base_params, ...local_params}})
        .then((what_came_back: any)  => {
            let openurl = new OpenURL(what_came_back.data);
            res.redirect(302, openurl.targetLink);
        });
}

router.get('/:mms_id', redirectToItem);

export default router;