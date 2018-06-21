import {Request} from "express";

function validate(req: Request): boolean {
    const body = req.body;
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

    if (body.lti_message_type !== 'basic-lti-launch-request' && body.lti_version !== 'LTI-1p0') {
        return false;
    }

    return true;
}

export default validate;