class Course {
    public id: string = '';
    public name: string = '';
    public number: string = '';
    public section: string = '';
    public department: string = '';
    public code: string = '';
    public status: string = '';
    public instructors: string = '';
    public note: string = '';
    public reading_lists: any = [];
    public has_readings: boolean = false;
    public research_guides: any = [];
    public has_research_guides: boolean = false;
    public subject_info: any = {};

    public addList(list: any): void {
        this.has_readings = true;
        this.reading_lists.push(list);
    }

    public loadFromAlma(alma_course: any) {
        let instructors = [];
        if (alma_course.instructor) {
            instructors = alma_course.instructor.map((instructor: any) => ({
                first_name: instructor.first_name,
                last_name: instructor.last_name
            }));
        }

        this.has_readings = false;
        this.id = alma_course.id || null;
        this.name = alma_course.name || null;
        this.section = alma_course.section || null;
        this.department = alma_course.academic_department ? alma_course.academic_department.value : null;
        this.code = alma_course.code || null;
        this.status = alma_course.status || null;
        this.instructors = instructors || null;
        this.note = alma_course.note || null;
        this.reading_lists = [];
    }

}

export default Course;