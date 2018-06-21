import Citation from './Citation';

class ReadingList {
    public id: string;
    public code: string;
    public name: string;
    public status: string;
    public citations: Citation[];


    constructor(listFromAlma: any) {
        this.id = listFromAlma.id;
        this.code = listFromAlma.code;
        this.name = listFromAlma.name;
        this.status = listFromAlma.status;
        this.citations = listFromAlma.citations.citation.map((citation: any) => new Citation(citation));
    }
}

export default ReadingList;