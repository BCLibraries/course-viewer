import {promisify} from 'util';
import xml2js from 'xml2js';

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

async function parseAVAFields(availabilityXML:string) {
    const data = await parseStringAsync(availabilityXML);
    const avaDatafields = data.record.datafield.filter((field: any) => {
        return field.$.tag === 'AVA';
    });
    return avaDatafields;
}

export default parseAVAFields;