import SectionList from "./SectionList";

class User {
    public readonly uid: string;

    public sections: SectionList = new SectionList();
    private _empty: boolean = true;

    public constructor(uid: string) {
        this.uid = uid;
    }

    /**
     * Has the user been populated?
     */
    get empty(): boolean {
        return this._empty;
    }

    /**
     * Mark the user as populated
     */
    public found() {
        this._empty = false;
    }
}

export default User;