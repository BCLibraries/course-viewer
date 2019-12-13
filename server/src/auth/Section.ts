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
        this.sectionNum = ldapId.substr(8, 2);
        this.year = +ldapId.substr(10, 4);
        this.semester = ldapId.substr(14, 1);
    }
}

export default Section;