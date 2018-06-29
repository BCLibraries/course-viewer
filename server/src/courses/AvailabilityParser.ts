import {promisify} from 'util';
import xml2js from 'xml2js';
import AvailabilityInfo from "./AvailabilityInfo";

/* tslint: disable */

const parseStringAsync = promisify(xml2js.parseString);

interface IStringMap {
    [index: string]: string;
}

const avaCodeMap: IStringMap = {
    'b': 'library',
    'c': 'location',
    'd': 'callNumber',
    'e': 'availability',
    'q': 'locationName'
};


async function setAvailability(availabilityXML: string) {
    const data = await parseStringAsync(availabilityXML);
}


async function parseAVAFields(availabilityXML:string) {
    const data = await parseStringAsync(availabilityXML);
    console.log(data.record.datafields);
    const avaDatafields = data.record.datafield.filter((field: any) => {
        return field.$.tag === 'AVA';
    });
    return avaDatafields;
}

function oldParse(datafields: any) {
    const availabilities: AvailabilityInfo[] = [];

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
                availabilities.push(availability);
            }
        );
    }
    return availabilities;
}

export default parseAVAFields;