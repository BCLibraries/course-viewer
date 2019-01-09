class Course {
    public static buildFromId(courseSisId: string): Course {
        const course = new Course;
        const match = courseSisId.match(/([A-Z]{4,5})(\d{4})(\d{2})(\d{4}[SFU])/);

        course.id = courseSisId;
        if (match) {
            course.subject = match[1];
            course.number = match[2];
            course.section = match[3];
            course.semester = match[4];
        }

        return course;
    }

    public static buildFromCourseAndSection(courseId: string, sectionId: string): Course {
        const course = new Course;
        const match = courseId.match(/([A-Z]{4,6})(\d+)/);
        if (match) {
            course.subject = match[1];
            course.number = match[2];
        } else {
            course.subject = courseId;
        }
        course.section = sectionId;
        return course;
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