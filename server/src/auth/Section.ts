/**
 * A single course section
 */
class Section {
    public readonly ldapIdentifier: string;
    public readonly subjectCode: string;
    public readonly courseNum: string;
    public readonly sectionNum: string;
    public readonly semester: string;
    public readonly year: number;

    public constructor(ldapId: string) {
        this.ldapIdentifier = ldapId;
        this.subjectCode = ldapId.substr(0, 4);
        this.courseNum = ldapId.substr(4, 4);
        this.sectionNum = ldapId.substr(9, 2);
        this.year = +ldapId.substr(12, 4);
        const semesterCode = ldapId.substr(16, 4);
        this.semester = semesterCodeToLetter(semesterCode);
    }
}

function semesterCodeToLetter(code: string): string {
    switch (code) {
        case 'SUMM':
            return 'U';
            break;
        case 'FALL':
            return 'F';
            break;
        default:
            console.log(code);
            return 'S';
    }
}

export default Section;