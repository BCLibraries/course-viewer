import {Request} from "express";

/**
 * Make sure the request is a valid LTI request
 *
 * @param req
 */
function validate(req: Request): boolean {
    const body = req.body;

    // Make sure all required fields are present.
    const reqFields: string[] = [
        'lti_message_type',
        'lti_version',
        'oauth_consumer_key',
        'resource_link_id'
    ];
    const reqFieldsPresent = reqFields.every((field: string): boolean => {
        return body[field];
    });

    if (!reqFieldsPresent) {
        return false;
    }

    // Make sure it's an LTI launch with an appropriate version.
    if (body.lti_message_type !== 'basic-lti-launch-request' && body.lti_version !== 'LTI-1p0') {
        return false;
    }

    return true;
}

export default validate;