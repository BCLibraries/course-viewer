import xml2js from 'xml2js';

interface IStringMap {
    [index: string]: string;
}

const ebookLabel = 'E-book';

const avaCodeMap: IStringMap = {
    'b': 'library',
    'c': 'location',
    'd': 'call_number',
    'e': 'availability'
};

const libraryCodeMap: IStringMap = {
    'BAPST': 'Bapst Library',
    'ERC': 'Educational Resource Center',
    'ONL': "O'Neill Library",
    'TML': 'Theology and Ministry Library',
    'SWK': 'Social Work Library'
};

class Citation {
    public sortTitle: string = '';
    public id: string;
    public status: string;
    public type: { primary: string; secondary: string };
    public metadata: any;
    public availability: any;

    constructor(almaCite: any) {
        this.id = almaCite.id;
        this.status = almaCite.status.value;
        this.type = {
            primary: isEbook(almaCite) ? ebookLabel : almaCite.type.desc,
            secondary: almaCite.secondary_type.desc
        };
        this.metadata = almaCite.metadata;

        if (this.metadata.title) {
            this.metadata.title = this.metadata.title.replace(/\/$/, "");
        }

        if (this.metadata.author) {
            this.metadata.author = this.metadata.author.replace(/,$/, "");
        }

        this.sortTitle = this.buildSortTitle();
    }

    public setAvailability(availabilityXML: string, library: string) {
        xml2js.parseString(availabilityXML, (err: any, result: any) => {
            const avaData = parseAVAFields(result.record.datafield);
            avaData.sort((a:any, b:any) => {

                if (a.library === library && b.library !== library) {
                    return -1;
                }

                if (a.library !== library && b.library === library) {
                    return 1;
                }

                if (a.library !== library && b.library !== library) {
                    return 0;
                }

                if (a.location.includes('Reserves')) {
                    return -1;
                }

                if (b.location.includes('Reserves')) {
                    return 1
                }
                return 0;
            });
            if (avaData.length > 0) {
                this.availability = avaData;
            }
        })
    }

    private buildSortTitle() {
        let sortTitle = this.sortTitle;
        if (this.metadata.title) {
            sortTitle = this.metadata.title;
        } else if (this.metadata.article_title) {
            sortTitle = this.metadata.article_title
        } else if (this.metadata.journal_title) {
            sortTitle = this.metadata.journal_title;
        }

        return sortTitle.toLowerCase().replace(/the |a |an /, '');
    }
}

function isEbook(almaCite: any) {
    if (almaCite.secondary_type.desc === ebookLabel || almaCite.type.desc === ebookLabel) {
        return true;
    }
    return almaCite.metadata.pages && almaCite.metadata.pages.includes('online');
}

function parseAVAFields(datafields: any) {
    const availabilities: any[] = [];

    const avaDatafields = datafields.filter((field: any) => {
        return field.$.tag === 'AVA';
    });

    if (avaDatafields.length > 0) {
        avaDatafields.forEach((datafield: any) => {
                const availability: IStringMap = {};
                datafield.subfield.forEach((subfield: any) => {
                    const subfieldCode: any = subfield.$.code;
                    const fieldName = avaCodeMap[subfieldCode];
                    if (fieldName) {
                        availability[fieldName] = subfield._;
                    }
                });
                if (availability.library && libraryCodeMap[availability.library]) {
                    availability.library = libraryCodeMap[availability.library];
                }
                availabilities.push(availability);
            }
        );
    }
    return availabilities;
}

export default Citation;