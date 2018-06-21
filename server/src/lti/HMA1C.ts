/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 * Authors: Owen Smith & Christian Murhpy
 * https://github.com/ChristianMurphy/ims-lti/blob/refactor/decaffeinate-code
 * Adapted for typescript by Ben Florin
 */
import crypto from 'crypto';
import url from 'url';

// Cleaning involves:
//   stripping the oauth_signature from the params
//   encoding the values ( yes this double encodes them )
//   sorting the key/value pairs
//   joining them with &
//   encoding them again
//
// Returns a string representing the request
function cleanRequestBody(body: any, query: any) {
    const out: any[] = [];

    const encodeParam = (key: string, val: string) => `${key}=${special_encode(val)}`;

    const cleanParams = (params: any[]) => {
        if (typeof params !== 'object') {
            return;
        }

        for (const key in  params) {
            if (params.hasOwnProperty(key)) {
                const vals = params[key];

                if (key === 'oauth_signature') {
                    continue;
                }

                if (Array.isArray(vals) === true) {
                    for (const val of Array.from(vals)) {
                        out.push(encodeParam(key, val.toString()));
                    }
                } else {
                    out.push(encodeParam(key, vals));
                }
            }
        }

    };

    cleanParams(body);
    cleanParams(query);

    return special_encode(out.sort().join('&'));
}


class HmacSha1 {

    public toString() {
        return 'HMAC_SHA1';
    }

    public buildSignatureRaw(reqUrl: string, parsedUrl: any, method: string, params: string, secret: string, token: any) {
        const sig = [
            method.toUpperCase(),
            special_encode(reqUrl),
            cleanRequestBody(params, parsedUrl.query)
        ];
        return this.signString(sig.join('&'), secret, token);
    }

    public buildSignature(req, body, consumer_secret, token) {
        const hapiRawReq = req.raw && req.raw.req;
        if (hapiRawReq) {
            req = hapiRawReq;
        }

        let originalUrl = req.originalUrl || req.url;
        let {protocol} = req;

        // Since canvas includes query parameters in the body we can omit the query string
        if (body.tool_consumer_info_product_family_code === 'canvas') {
            originalUrl = url.parse(originalUrl).pathname;
        }

        if (protocol === undefined) {
            const {encrypted} = req.connection;
            protocol = (encrypted && 'https') || 'http';
        }

        const parsedUrl = url.parse(originalUrl, true);
        const hitUrl = protocol + '://' + req.headers.host + parsedUrl.pathname;

        return this.buildSignatureRaw(hitUrl, parsedUrl, req.method, body, consumer_secret, token);
    }

    public signString(str: string, key: any, token: any) {
        key = `${key}&`;
        if (token) {
            key += token;
        }
        return crypto.createHmac('sha1', key).update(str).digest('base64');
    }
}

function special_encode(str: string) {
    encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, '%2A');
}

export default HmacSha1;