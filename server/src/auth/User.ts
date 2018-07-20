interface ICourse {
    courseNum: string,
    sectionNum: string,
    courseName?: string
}

class User {
    public readonly uid: string;

    private _empty: boolean = true;
    private _courses: ICourse[] = [];

    public constructor(uid: string) {
        this.uid = uid;
    }

    get empty(): boolean {
        return this._empty;
    }

    get courses(): ICourse[] {
        return this._courses;
    }

    public found() {
        this._empty = false;
    }

    public addCourse(course: ICourse) {
        this._courses.push(course);
    }
}

export {User, ICourse};