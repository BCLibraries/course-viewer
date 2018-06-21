// let xml2js = require('xml2js');
import xml2js from 'xml2js';

interface stringMap {
    [index: string]: string;
}

const ebookLabel = 'E-book';

const avaCodeMap: stringMap = {
    'b': 'library',
    'c': 'location',
    'd': 'call_number',
    'e': 'availability'
};

class Citation {
    public sortTitle: string = '';
    public id: string;
    public status: string;
    public type: { primary: string; secondary: string };
    public metadata: any;
    public availability: any;

    constructor(almaCite: any) {
        const metadata = almaCite.metadata;
        const primaryType = isEbook(almaCite.type.desc, almaCite.secondary_type.desc) ? ebookLabel : almaCite.type.desc;

        this.id = almaCite.id;
        this.status = almaCite.status.value;
        this.type = {
            primary: primaryType,
            secondary: almaCite.secondary_type.desc
        };
        this.metadata = metadata;

        if (metadata.title) {
            metadata.title = metadata.title.replace(/\/$/, "");
        }

        if (metadata.author) {
            metadata.author = metadata.author.replace(/,$/, "");
        }

        this.sortTitle = metadata.title ? metadata.title : metadata.article_title;
    }

    public setAvailability(availabilityXML: string) {
        xml2js.parseString(availabilityXML, (err: any, result: any) => {
            const avaData = parseAVAFields(result.record.datafield);
            if (avaData.length > 0) {
                this.availability = avaData;
            }
        })
    }
}

/*
function isBookChapter() {
    let foo = new CitationType();
    foo.delivery = CitationType.DELIVERY.Electronic;
    foo.delivery = "electronic";
}
*/

function isEbook(primaryType: string, secondaryType: string) {
    return secondaryType === ebookLabel;
}

function parseAVAFields(datafields: any) {
    const availabilities: any[] = [];

    const avaDatafields = datafields.filter((field: any) => {
        return field.$.tag === 'AVA';
    });

    if (avaDatafields.length > 0) {
        avaDatafields.forEach((datafield: any) => {
                const availability: stringMap = {};
                datafield.subfield.forEach((subfield: any) => {
                    const subfieldCode: any = subfield.$.code;
                    const fieldName = avaCodeMap[subfieldCode];
                    if (fieldName) {
                        availability[fieldName] = subfield._;
                    }
                });
                availabilities.push(availability);
            }
        );
    }
    return availabilities;
}

export default Citation;