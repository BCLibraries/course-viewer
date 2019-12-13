/**
 * Represents a single course
 *
 * TODO: possibly merge with client courses?
 */
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
    public isActive: boolean = false;

    /**
     * Add a reading list
     *
     * @param {} list a reading list from an Alma API call
     */
    public addList(list: any): void {
        this.has_readings = true;
        this.reading_lists.push(list);
    }

    /**
     * Load from an Alma API response
     *
     * @param {} alma_course Alma course from API response
     */
    public loadFromAlma(alma_course: any) {
        this.has_readings = false;
        this.id = alma_course.id || null;
        this.name = alma_course.name || null;
        this.section = alma_course.section || null;
        this.department = alma_course.academic_department ? alma_course.academic_department.value : null;
        this.code = alma_course.code || null;
        this.status = alma_course.status || null;
        this.instructors = alma_course.instructor ? alma_course.instructor.map(buildInstructor) : [];
        this.note = alma_course.note || null;
        this.reading_lists = [];
        this.isActive = true;
    }

}

/**
 * Build a single instructor from an Alma API response
 *
 * @param {} instructor Alma instructor from Course API response
 */
function buildInstructor(instructor: any) {
    return {
        first_name: instructor.first_name,
        last_name: instructor.last_name
    };
}

export default Course;