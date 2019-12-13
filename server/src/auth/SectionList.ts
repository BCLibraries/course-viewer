import {TSemester, TYear} from '../Types';
import Section from './Section';

/**
 * List of sections a user is attached to
 */
class SectionList {
    private _sectionsAsStudent: Section[] = [];
    private _sectionsAsInstructor: Section[] = [];

    /**
     * Add user to section as student
     *
     * @param section
     */
    public addAsStudent(section: Section) {
        this._sectionsAsStudent.push(section);
    }

    /**
     * Add user to section as instructor
     *
     * @param section
     */
    public addAsInstructor(section: Section) {
        this._sectionsAsInstructor.push(section);
    }

    /**
     * Return all courses a user is enrolled in for a given year and semester
     *
     * @param year
     * @param semester
     */
    public coursesAsStudent(year: TYear, semester: TSemester) {
        return this.read(year, semester, this._sectionsAsStudent);
    }

    /**
     * Return all courses a user is instructor of for a given year and semester
     *
     * @param year
     * @param semester
     */
    public coursesAsInstructor(year: TYear, semester: TSemester) {
        return this.read(year, semester, this._sectionsAsInstructor);
    }

    /**
     * Find courses in a list that match the current year and semester
     *
     * @param year
     * @param semester
     * @param source
     */
    private read(year: TYear, semester: TSemester, source: Section[]) {
        const callback = (section: Section) => (section.year === year && section.semester === semester);
        return source.filter(callback);
    }
}

export default SectionList;