import {TSemester, TYear} from '../Types';
import Section from './Section';

class SectionList {
    private _sectionsAsStudent: Section[] = [];
    private _sectionsAsInstructor: Section[] = [];

    public addAsStudent(section: Section) {
        this._sectionsAsStudent.push(section);
    }

    public addAsInstructor(section: Section) {
        this._sectionsAsInstructor.push(section);
    }

    public coursesAsStudent(year: TYear, semester: TSemester) {
        return this.read(year, semester, this._sectionsAsStudent);
    }

    public coursesAsInstructor(year: TYear, semester: TSemester) {
        return this.read(year, semester, this._sectionsAsInstructor);
    }

    private read(year: TYear, semester: TSemester, source: Section[]) {
        const callback = (section: Section) => (section.year === year && section.semester === semester);
        return source.filter(callback);
    }
}

export default SectionList;