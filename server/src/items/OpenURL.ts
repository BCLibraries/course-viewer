const parseString = require('xml2js').parseString;

/**
 * Parse a Primo OpenURL XML response
 */
class OpenURL {

    private _targetLink: string = '';

    constructor(xml: string) {
        this._targetLink = '';
        parseString(xml, (err: any, parsed: any) => {
            this.parseXML(err, parsed)
        });
    }

    /**
     * Item target link
     */
    get targetLink(): string {
        return this._targetLink;
    }

    /**
     * Extract target link from XML
     *
     * @param err
     * @param parsed
     */
    parseXML(err: any, parsed: any): void {
        if (parsed.uresolver_content.context_services[0].context_service[0].target_url) {
            this._targetLink = parsed.uresolver_content.context_services[0].context_service[0].target_url[0];
        }
    }
}

module.exports = OpenURL;