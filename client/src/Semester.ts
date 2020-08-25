/**
 * Represent a single BC semester
 *
 * BC represents its semesters by 4-digit numeric academic years and single-letter codes.
 * The codes are:
 *
 *  * F - Fall
 *  * S - Spring
 *  * U - Summer
 *
 *  The academic year turnover happens at the beginning of Fall semester, which means fall
 *  year numbers are one ahead of their calendar years (e.g. "2021F" would start in September
 *  2020).
 *
 *  Right now this class only provides access to a single instance of a Semester that
 *  represents the current semester as defined in the ENV. Use Semester.currentSemester()
 *  to access this instance.
 */
class Semester {

    private static instance: Semester;

    /**
     * Year as represented in UIS
     */
    public codeYear: number;

    /**
     * Semester as represented in UIS
     */
    public codeSemester: string;

    /**
     * Human readable year
     */
    public displayYear: string;

    /**
     * Human readable semester
     */
    public displaySemester: string;

    private constructor(year: number, semester: string) {

        // Assign year code values
        this.codeYear = year;
        this.codeSemester = semester;

        // Determine year display values
        this.displayYear = String(this.codeYear);
        switch (this.codeSemester) {
            case 'F':
                this.displaySemester = 'Fall';
                this.displayYear = String(this.codeYear - 1);
                break;
            case 'U':
                this.displaySemester = 'Summer';
                break;
            case 'S':
                this.displaySemester = 'Spring';
                break;
            default:
                throw new Error(`${this.codeSemester} is not a valid semester code`);
        }

    }

    /**
     * Get a Semester object representing the current semester
     */
    public static currentSemester(): Semester {
        if (!Semester.instance) {
            this.buildSemesterFromEnv();
        }
        return Semester.instance;
    }

    /**
     * Build a semester using values in an .env file
     *
     * @private
     */
    private static buildSemesterFromEnv() {
        const yearCode = Number(process.env.REACT_APP_CURRENT_YEAR);
        const semesterCode = String(process.env.REACT_APP_CURRENT_SEMESTER);
        Semester.instance = new Semester(yearCode, semesterCode);
        Object.freeze(Semester.instance);
    }
}

export default Semester;