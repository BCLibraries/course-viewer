/**
 * A course
 *
 * Full courses can be populated from a Client, or stub courses may be build with just identifying strings
 * using static builder methods.
 *
 */
class Course {

    /**
     * Build from a course ID ("THEO1075") and section ID ("01")
     *
     * @param courseId
     * @param sectionId
     */
    public static buildFromCourseAndSection(courseId: string, sectionId: string): Course {
        const match = courseId.match(/([A-Z]{4,6})(\d+X?)/);

        const course = new Course();
        if (match) {
            course.subject = match[1];
            course.number = match[2];
        } else {
            course.subject = courseId;
        }
        course.section = sectionId;
        Object.freeze(course);
        return course;
    }

    /**
     * Build from an Alma course_sis_id
     *
     * @param courseSisId
     */
    public static buildFromId(courseSisId: string): Course {
        const match = courseSisId.match(/([A-Z]{4,5})(\d{4})(\d{2})(\d{4}[SFU])/);

        const course = new Course();
        course.id = courseSisId;
        if (match) {
            course.subject = match[1];
            course.number = match[2];
            course.section = match[3];
            course.semester = match[4];
        }
        Object.freeze(course);
        return course;
    }

    /**
     * Is this a Law School course?
     */
    public isLawSchool(): boolean {
        return this.subject.indexOf('LAWS') !== -1;
    }

    public id: string = '';
    public code: string = '';
    public lists: any = [];
    public name: string = '';
    public hasReadings: boolean = false;
    public section: string = '';
    public number: string = '';
    public subject: string = '';
    public semester: string = '';
    public subjectInfo: any = {
        slug: null,
        url: null,
    };
    public researchGuides: any = [];
}

export default Course;