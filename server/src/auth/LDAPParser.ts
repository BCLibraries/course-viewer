import Section from "./Section";
import SectionList from "./SectionList";

interface ILDAPResponse {
    bcismemberof?: string[],
    courseinstructorof?: string[]
}

const sectionRegEx = /^cn=([A-Z]{4}\d{4}[X[0-9]\d\d{4}[SFU])/;

function parse(ldapObj: ILDAPResponse): SectionList {

    const sections = new SectionList;

    const taughtSectionStrings = ldapObj.courseinstructorof ? ldapObj.courseinstructorof : [];
    taughtSectionStrings.forEach((sectionString: string) => {
            const section = new Section(sectionString);
            sections.addAsInstructor(section);
        }
    );

    const sectionStrings = ldapObj.bcismemberof ? ldapObj.bcismemberof.reduce(parseMemberOf, []) : [];
    sectionStrings.forEach((sectionString: string) => {
            const section = new Section(sectionString);
            sections.addAsStudent(section);
        }
    );

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