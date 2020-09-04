/**
 * Represents a user
 */
export type UserType = {
    sections: {
        _sectionsAsStudent: [any],
        _sectionsAsInstructor: [any],
    }
    _empty: boolean,
    uid: string
}