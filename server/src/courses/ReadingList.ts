import Citation from './Citation';

interface IStringMap {
    [index: string]: string;
}

/**
 * Map Reserves processing department to a reserves access point
 */
const deptToLibMap: IStringMap = {
    'BAPSTCR': 'Bapst Library',
    'TMLCR': 'Theology and Ministry Library',
    'ONLCR': "O'Neill Library",
    'ERCCR': 'Educational Resource Center',
    'SWKCR': 'Social Work Library'
};

/**
 * An Alma reading list
 */
class ReadingList {
    public id: string;
    public code: string;
    public name: string;
    public status: string;
    public processDept: string;
    public citations: Citation[];


    constructor(listFromAlma: any, processDept: string) {
        this.id = listFromAlma.id;
        this.code = listFromAlma.code;
        this.name = listFromAlma.name;
        this.status = listFromAlma.status;
        const sourceCitations = listFromAlma.citations.citation ? listFromAlma.citations.citation : [];
        this.citations = sourceCitations.map((citation: any) => new Citation(citation));
        this.processDept = deptToLibMap[processDept] ? deptToLibMap[processDept] : processDept;
    }
}

export default ReadingList;