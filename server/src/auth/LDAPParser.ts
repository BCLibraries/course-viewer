import Section from "./Section";
import SectionList from "./SectionList";
import {SearchEntryObject} from "ldapjs";
import {type} from "os";

interface ILDAPResponse {
    bcismemberof?: string[],
    courseinstructorof?: string[]
}

const sectionRegEx = /^cn=([A-Z]{4}\d{4}[X[0-9]\d\d{4}[SFU])/;

/**
 * Parse LDAP response to extract course information
 *
 * LDAP responses include 'courseinstructorof' and 'bcismemberof' attributes. 'courseinstructorof' contains
 * courses the user is an instructor of. 'bcismemberof' contains courses that the user is either
 * a student in or an instructor of. We use these attributes to determine what courses a user
 * is an instructor of, and what courses they are a student in.
 *
 * @param ldapObj
 */
function parse(ldapObj: any): SectionList {

    const sections = new SectionList;

    // Add all courses in 'courseinstructorof' to the list of courses taught by the user.
    const taughtSectionStrings = ldapObj.courseinstructorof ? ldapObj.courseinstructorof : [];
    taughtSectionStrings.forEach((sectionString: string) => {
            const section = new Section(sectionString);
            sections.addAsInstructor(section);
        }
    );

    // Add all courses that are in 'bcismemberof' but not 'courseinstructorof' to the courses
    // the user is enrolled in.
    const sectionStrings = ldapObj.bcismemberof ? ldapObj.bcismemberof.reduce(parseMemberOf, []) : [];
    sectionStrings.forEach((sectionString: string) => {
            const section = new Section(sectionString);
            sections.addAsStudent(section);
        }
    );

    // Check if a course is in both 'bcismemberof' and 'courseinstructorof'.
    function parseMemberOf(result: string[], memberOfString: string) {
        const ldapMatches = memberOfString.match(sectionRegEx);
        if (ldapMatches && taughtSectionStrings.indexOf(ldapMatches[1]) === -1) {
            result.push(ldapMatches[1]);
        }
        return result;
    }

    return sections;

}


export default parse;