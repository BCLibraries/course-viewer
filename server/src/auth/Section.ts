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

        // Strip all hyphens to normalize between old-style (NURS2122-02-2021FALL) and new-style
        // (NURS2122022021F) codes.
        this.ldapIdentifier = ldapId;
        const normalizedLdapId = ldapId.replace(/-/g, '');

        this.subjectCode = normalizedLdapId.substr(0, 4);
        this.courseNum = normalizedLdapId.substr(4, 4);
        this.sectionNum = normalizedLdapId.substr(8, 2);
        this.year = +normalizedLdapId.substr(10, 4);

        const restOfString = normalizedLdapId.substr(14)
        this.semester = semesterCodeToLetter(restOfString);
    }
}

/**
 * Convert end of LDAP section ID to semester code
 *
 * LDAP section IDs can end in a full semester string (e.g. NURS2122-02-2021FALL)
 * or an abbreviated form (e.g. NURS2122022021F). This fuction takes whichever
 * form and returns just a single-character code.
 *
 * @param {string} code
 */
function semesterCodeToLetter(code: string): string {
    switch (code) {
        case 'SUMM':
            return 'U';
            break;
        case 'FALL':
            return 'F';
            break;
        case 'U':
            return 'U';
        case 'F':
            return 'F'
        default:
            return 'S';
    }
}

export default Section;