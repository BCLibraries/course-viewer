const parseString = require('xml2js').parseString;

class OpenURL {

    private _targetLink: string;
    private raw: any;

    constructor(xml: string) {
        this._targetLink = '';
        parseString(xml, (err: any, parsed: any) => {
            this.parseXML(err, parsed)
        });
    }

    get targetLink(): string {
        return this._targetLink;
    }

    parseXML(err: any, parsed: any): void {
        this.raw = parsed;
        this._targetLink = parsed.uresolver_content.context_services[0].context_service[0].target_url[0];
    }
}

module.exports = OpenURL;