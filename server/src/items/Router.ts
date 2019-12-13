import {Request, Response} from "express";

const axios = require('axios');
const OpenURL = require('./OpenURL');

// Add to route for redirection to router.
let router = require('express').Router();
router.get('/:mms_id', redirectToItem);

// TODO: replace linkToPrimoBase with an env variable that links directly to Primo
const linkToPrimoBase = 'http://bclib.bc.edu/libsearch/bc/keyword';

/**
 * Redirect to an item by MMS id
 *
 * Item links look up the item in Primo by OpenURL then redirect to the appropriate link, e.g.
 *
 *     https://mlib.bc.edu/reserves-api/items/99137752995101021
 *
 * This (hopefully) links directly to electronic items. If we can't figure out a direct link
 * we send them to the item's record page in Primo.
 *
 * TODO: Cache OpenURLs for faster linking
 *
 * @param req
 * @param res
 */
function redirectToItem(req: Request, res: Response) {

    // The fallback URL is the item's Primo record.
    const fallbackItemUrl = `${linkToPrimoBase}/${req.params.mms_id}`;

    // Send a request to Primo via OpenURL.
    const openURLParams = {
        svc_dat: 'CTO', // Required for XML response
        debug: true, // Required for XML response
        'rft.mms_id': req.params.mms_id
    };
    axios.get(process.env.OPENURL_BASE, {params: openURLParams})
        .then((response: any) => {

            // Parse the OpenURL and find an appropriate target URL for the item.
            let openurl = new OpenURL(response.data);
            const itemUrl = openurl.targetLink ? openurl.targetLink : fallbackItemUrl;

            // Redirect to the item.
            res.redirect(302, itemUrl);
        });
}

export default router;